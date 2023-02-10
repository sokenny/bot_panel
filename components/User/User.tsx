import { useEffect } from "react";
import { IUser } from "../../types";
import styles from "./User.module.css";

const User: React.FC<{ user: IUser }> = ({ user }) => {
  useEffect(() => {
    fetch(`/api/users/${user._id}/state`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Password": process.env.NEXT_PUBLIC_PASSWORD || "",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // TODO-p1: set state of user
      })
      .catch((err) => console.log(err));
  }, [user]);

  return (
    <div className={styles.User} key={user._id}>
      <div className={styles.identity}>
        <div className={styles.status}></div>
        <div className={styles.email}>{user.email}</div>
      </div>
      <div className={styles.btns}>
        <div className={styles.primary}>logs</div>
        <div className={styles.edit}>edit</div>
      </div>
    </div>
  );
};

export default User;
