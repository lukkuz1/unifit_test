import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { rtdb } from "src/services/firebase";
import { child, ref, set, get, update } from "firebase/database";

type Props = {
  children?: React.ReactNode;
}

type UserData = {
  email: string;
  uid: string;
}

type UserContextData = {
  initialized: boolean;
  user: UserData;
  month: number;
  day: number;
  hours: number;
  steps: {};
  hourlySteps: number;
  distanceHistory: {};
  totalPoints: number;
  dailyPoints: number;
  weight: number;
  height: number;
  age: number;
  stepGoal: number;
  initialize(user: UserData): Promise<void>;
  destroy(): void;
  syncStepsAndDistance(stepsCount: number, hourlySteps: number): Promise<void>;
  syncPoints(): Promise<void>;
  updatePoints(newPoints: number): Promise<void>;
  updateDataJSON(updateData: {}): Promise<void>;
}

const userContext = createContext({} as UserContextData)

export const useUser = () => {
  return useContext(userContext);
}

export const UserProvider: React.FC = ({ children }: Props) => {
  const [status, setStatus] = useState<boolean>(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [month, setMonth] = useState<number>(0);
  const [day, setDay] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [steps, setSteps] = useState<{}>({});
  const [hourlySteps, setHourlySteps] = useState<number>(0);
  const [distanceHistory, setDistanceHistory] = useState<{}>({});
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [dailyPoints, setDailyPoints] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [age, setAge] = useState<number>(0);
  const [stepGoal, setStepGoal] = useState<number>(0);

  const originalTotal = useRef<number>();

  useEffect(() => {
    const timeUpdateTick = () => {
      let today = new Date();

      if (today.getHours() != hours)
        setHours(today.getHours())
      if (today.getDate() != day)
        setDay(today.getDate())
      if (today.getMonth() != month)
        setMonth(today.getMonth())
    }

    timeUpdateTick();

    const timeUpdateInterval = setInterval(timeUpdateTick, 10000);
    return () => {
      clearInterval(timeUpdateInterval);
    }
  }, [])

  useEffect(() => {
    if (status) {
      console.log("useUser: User initialized (status = true)")
    } else {
      console.log("useUser: User is not initialized (status = false)")
    }
  }, [status]);

  useEffect(() => {
    if (user == null) {
      setStatus(false);
      setSteps({});
      setTotalPoints(0);
      setDailyPoints(0);
    }
  }, [user]);

  const initialize = async (user: UserData): Promise<void> => {
    if (user != null) {
      setUser(user);

      let userExists = true;
      let updateRequired = false;
      let snapshotTotalPoints: number;
      let snapshotDailyPoints: number;
      let snapshotDistanceHistory: number;
      let snapshotHourlySteps: number;
      let snapshotHeight: number;
      let snapshotWeight: number;
      let snapshotAge: number;
      let snapshotStepGoal: number;

      const dbRef = ref(rtdb);

      await get(child(dbRef, `users/${user.uid}`)).then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          snapshotDailyPoints = userData.dailyPoints;
          snapshotTotalPoints = userData.totalPoints;
          snapshotDistanceHistory = userData.distanceHistory;
          snapshotHourlySteps = userData.hourlySteps;
          snapshotHeight = userData.height;
          snapshotWeight = userData.weight;
          snapshotAge = userData.age;
          snapshotStepGoal = userData.stepGoal;

          if (userData.steps[month][day] != undefined) {
            console.log("Hello");
            setSteps(userData.steps);
            setDailyPoints(snapshotDailyPoints);
            if (userData.distanceHistory[hours] != undefined) {
              setHourlySteps(snapshotHourlySteps);
            }
            setDistanceHistory(snapshotDistanceHistory);
          } else {
            updateRequired = true;
          }

          setTotalPoints(snapshotTotalPoints);
          setHeight(snapshotHeight);
          setWeight(snapshotWeight);
          setAge(snapshotAge);
          setStepGoal(snapshotStepGoal);

          originalTotal.current = snapshotTotalPoints - snapshotDailyPoints;
        }
        else
          userExists = false;
      }).catch((error) => {
        console.error(error);
      });


      if (!userExists || updateRequired) {
        const newUserData = {
          [`/steps/${month}/${day}`]: 0,
          [`/distanceHistory`]: { [`${hours}`]: 0 },
          hourlySteps: 0,
          totalPoints: userExists ? snapshotTotalPoints : 0,
          dailyPoints: 0,
          weight: userExists ? snapshotWeight : 0,
          height: userExists ? snapshotHeight : 0,
          age: userExists ? snapshotAge : 0,
          stepGoal: userExists ? snapshotStepGoal : 6000,
        }

        await update(ref(rtdb, `users/${user.uid}`), newUserData).then(() => {
          let tempSteps = { ...steps, [`${month}`]: { [`${day}`]: 0 } };
          setSteps(tempSteps);

          let tempDistance = { ...distanceHistory, [`${hours}`]: 0 };
          setDistanceHistory(tempDistance);

          setDailyPoints(0);
          setHourlySteps(0);

          originalTotal.current = userExists ? snapshotTotalPoints : 0;
        }).catch((error) => {
          console.error(error);
        });
      }

      setStatus(true);
    }
  }

  const destroy = () => {
    setUser(null)
  }

  const getDistance = (stepCount: number): number => {
    return stepCount * 0.762 / 1000;
  }

  const syncStepsAndDistance = async (stepsCount: number, hourlyStepsCount: number): Promise<void> => {
    if (status) {
      if (stepsCount > steps[month][day] || hourlyStepsCount < hourlySteps) {
        const hourlyDistance = getDistance(hourlyStepsCount);

        let updateData = {
          [`steps/${month}/${day}`]: stepsCount,
          [`hourlySteps`]: hourlyStepsCount,
        };

        if (distanceHistory[hours] != undefined) {
          updateData = {
            ...updateData,
            [`distanceHistory/${hours}`]: hourlyDistance,
          }
        } else {
          updateData = {
            ...updateData,
            [`distanceHistory/${hours}`]: 0,
            [`hourlySteps`]: 0,
          }
        }

        await update(ref(rtdb, `users/${user.uid}`), updateData)
          .catch((error) => { console.error(error) })
          .finally(() => {

            let tempSteps = { ...steps };
            tempSteps[month][day] = stepsCount;
            setSteps(tempSteps);

            let tempDistance = { ...distanceHistory };
            tempDistance[hours] = hourlyDistance;
            setDistanceHistory(tempDistance);

            setHourlySteps(hourlyStepsCount);

            console.log("useUser: syncStepsAndDistance successful, steps: " + stepsCount);
          });
      }
    }
    else {
      console.log("Update steps error, user is not logged in")
    }
  }

  const syncPoints = async (): Promise<void> => {
    if (status) {
      let points = calculatePoints();
      if (points > dailyPoints) {
        const newTotal = originalTotal.current + points;

        const updateData = {
          totalPoints: newTotal,
          dailyPoints: points,
        }

        await update(ref(rtdb, `users/${user.uid}/`), updateData)
          .catch((error) => { console.error(error) })
          .finally(() => {
            console.log("useUser: syncPoints successful, total points: " + newTotal);
            console.log("useUser: syncPoints successful, daily points: " + points);
            setTotalPoints(newTotal);
            setDailyPoints(points);
          });
      }
    }
    else {
      console.log("Update points 1 error, user is not logged in")
    }
  }

  const calculatePoints = (): number => {
    let points = 0;
    let dailySteps = steps[month][day];

    if (steps[month][day] > 0) {
      for (let i = 1; i <= dailySteps; i++) {
        points += Math.pow(0.6, Math.floor((i - 1) / 6000));
      }
    }

    return points;
  }

  const updatePoints = async (newPoints: number): Promise<void> => {
    if (status && user) {
      try {
        await update(ref(rtdb, `users/${user.uid}`), { totalPoints: newPoints });
        setTotalPoints(newPoints);
      } catch (error) {
        console.error("Failed to update points", error);
      }
    } else {
      console.log("Update points error, user is not logged in or status is false");
    }
  };

  const updateDataJSON = async (updateData: any): Promise<void> => {
    if (status) {
      console.log(updateData);
      await update(ref(rtdb, `users/${user.uid}`), updateData)
        .finally(() => {
          if (updateData.weight != undefined) {
            setWeight(updateData.weight);
            console.log("Changed weight to: " + updateData.weight);
          }
          if (updateData.height != undefined) {
            setHeight(updateData.height);
            console.log("Changed height to: " + updateData.height);
          }
          if (updateData.stepGoal != undefined) {
            setStepGoal(updateData.stepGoal);
            console.log("Changed step goal to: " + updateData.stepGoal);
          }
          if (updateData.age != undefined) {
            setAge(updateData.age);
            console.log("Changed age to: " + updateData.age);
          }
        })
        .catch((error) => {
          console.error("updateDataJSON error: " + error);
        });
    }
  }

  return (
    <userContext.Provider value={{
      initialized: status,
      user: user,
      month: month,
      day: day,
      hours: hours,
      steps: steps,
      hourlySteps: hourlySteps,
      distanceHistory: distanceHistory,
      totalPoints: totalPoints,
      dailyPoints: dailyPoints,
      weight: weight,
      height: height,
      age: age,
      stepGoal: stepGoal,
      initialize,
      destroy,
      syncStepsAndDistance,
      syncPoints,
      updatePoints,
      updateDataJSON,
    }}>
      {children}
    </userContext.Provider>
  )
}
