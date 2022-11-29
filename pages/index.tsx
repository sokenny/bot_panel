import type { NextPage } from "next";
import Head from "next/head";
import { BotConfig, IUser } from "../types";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";

const users: IUser[] = [
  {
    id: 1,
    email: "juanchaher99@gmail.com",
    keys: {
      api_key: "",
      api_secret: "",
    },
  },
  {
    id: 2,
    email: "info.proto.id@gmail.com",
    keys: {
      api_key: "",
      api_secret: "",
    },
  },
];

const Home: NextPage<{config: BotConfig}> = ({config}) => {
  const [botConfig, setBotConfig] = useState<BotConfig>(config);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");

  function handleLogin(e:any) {
    e.preventDefault();

    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      });
  }

  if (!loggedIn) {
    return (
      <div className={`${styles.container} ${styles.Login}`}>
        <Head>
          <title>Login | BOT</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Passphrase"
              className={styles.field}
              onChange={(e) => setPassword(e.target.value)}
            />
          </form>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Panel | BOT</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.status}>
          <div>Status: </div>
          {/* TODO-p3 poner un circulito titilando */}
          <div>All systems normal</div>
        </div>
        <section>
          <div>
            <BotConfig config={botConfig} setConfig={setBotConfig} />
            <Users users={users} />
          </div>
        </section>
      </main>
    </div>
  );
};

const BotConfig: React.FC<{ config: BotConfig; setConfig: any }> = ({
  config,
  setConfig,
}) => {
  const [editing, setEditing] = useState<boolean>(false);
  const configBeforeEditingStarts = useRef<BotConfig>(config);

  useEffect(() => {
    if (editing) {
      configBeforeEditingStarts.current = config;
    }
  }, [editing]);

  function hasChanged(key:string) {
    return configBeforeEditingStarts.current[key as keyof BotConfig] !== config[key as keyof BotConfig];  
  }

  function somethingChanged() {
    return Object.keys(config).some(hasChanged);
  }

  function canSave() {
    return somethingChanged() && validateData();
  }

  function handleClickEdit() {
    if (confirm("By proceeding you will enter edit mode.")) {
      setEditing(true);
    }
  }

  function revertEditing() {
    setConfig(configBeforeEditingStarts.current);
    setEditing(false);
  }

  function positionStructureIsValid() {
    try {
      const positionStructure = eval(config.position_structure);
      return (
        Array.isArray(positionStructure) &&
        positionStructure.every((obj) => obj.weight)
      );
    } catch (e) {
      return false;
    }
  }

  function validateData() {
    return positionStructureIsValid();
  }

  async function handleClickSave() {
    if (confirm("By proceeding you will save the current configuration.")) {
      if (!validateData()) {
        alert("Invalid position structure");
        return;
      }

      await fetch("/api/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Password": process.env.NEXT_PUBLIC_PASSWORD || "",
        },
        body: JSON.stringify(config),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            setEditing(false);
            configBeforeEditingStarts.current = config;
          } else {
            alert("Error saving config");
          }
        });
    }
  }

  return (
    <section
      className={`${styles.config} ${editing ? styles["config-editing"] : ""}`}
    >
      <div className={styles.titleSection}>
        <div className={styles.title}>Bot Config</div>
        {editing ? (
          <>
            <div className={styles.btnContainer}>
              <div
                className={`${styles.save} ${
                  canSave() ? styles["save-valid"] : ""
                }`}
                onClick={handleClickSave}
              >
                SAVE
              </div>
              <div className={styles.cancel} onClick={revertEditing}>
                CANCEL
              </div>
            </div>
          </>
        ) : (
          <div className={styles.edit} onClick={handleClickEdit}>
            EDIT
          </div>
        )}
      </div>
      <div className={styles.configList}>
        <div className={styles.fieldContainer}>
          <label>
            Pair
            <span>💰</span>
          </label>
          <input
            disabled={!editing}
            className={`${styles.field} ${
              hasChanged("pair") ? styles["field-changed"] : ""
            }`}
            onChange={(e) => setConfig({ ...config, pair: e.target.value })}
            name="pair"
            type="text"
            value={config.pair}
          />
        </div>

        <div className={styles.fieldContainer}>
          <label>
            Strategy
            <span>🎯</span>
          </label>
          <select
            disabled={!editing}
            className={`${styles.field} ${
              hasChanged("strategy") ? styles["field-changed"] : ""
            }`}
            onChange={(e) => setConfig({ ...config, strategy: e.target.value })}
            name="strategy"
            value={config.strategy}
          >
            <option value="reversion">reversion</option>
            <option value="tracing-short">tracing-short</option>
            <option value="tracing-long">tracing-long</option>
          </select>
        </div>

        <div className={styles.fieldContainer}>
          <label>
            Op. Expiry Time
            <span>⌛</span>
          </label>
          <input
            disabled={!editing}
            className={`${styles.field} ${
              hasChanged("operation_expiry_time") ? styles["field-changed"] : ""
            }`}
            onChange={(e) =>
              setConfig({
                ...config,
                operation_expiry_time: parseInt(e.target.value),
              })
            }
            name="operation_expiry_time"
            type="number"
            value={config.operation_expiry_time}
          />
        </div>

        <div className={styles.fieldContainer}>
          <label>
            CCI Peak
            <span>📈</span>
          </label>
          <input
            disabled={!editing}
            className={`${styles.field} ${
              hasChanged("cci_peak") ? styles["field-changed"] : ""
            }`}
            onChange={(e) =>
              setConfig({ ...config, cci_peak: parseInt(e.target.value) })
            }
            type="number"
            value={config.cci_peak}
          />
        </div>

        <div className={styles.fieldContainer}>
          <label>
            Stop Loss
            <span>🚫</span>
          </label>
          <input
            disabled={!editing}
            className={`${styles.field} ${
              hasChanged("stop_loss") ? styles["field-changed"] : ""
            }`}
            onChange={(e) =>
              setConfig({ ...config, stop_loss: parseInt(e.target.value) })
            }
            name="stop_loss"
            type="number"
            value={config.stop_loss}
          />
        </div>

        <div className={styles.fieldContainer}>
          <label>
            Take Profit
            <span>💸</span>
          </label>
          <input
            disabled={!editing}
            className={`${styles.field} ${
              hasChanged("take_profit") ? styles["field-changed"] : ""
            }`}
            onChange={(e) =>
              setConfig({ ...config, take_profit: parseInt(e.target.value) })
            }
            name="take_profit"
            type="number"
            value={config.take_profit}
          />
        </div>

        <div className={styles.fieldContainer}>
          <label>
            Position Struc.
            <span>🏗️</span>
          </label>
          <input
            disabled={!editing}
            className={`${styles.field} ${
              hasChanged("position_structure") ? styles["field-changed"] : ""
            } ${!positionStructureIsValid() ? styles["field-invalid"] : ""}`}
            onChange={(e) =>
              setConfig({ ...config, position_structure: e.target.value })
            }
            name="position_structure"
            type="text"
            value={config.position_structure}
          />
        </div>

        <div className={styles.fieldContainer}>
          <label>
            Start Gap Perc.
            <span>⏩</span>
          </label>
          <input
            disabled={!editing}
            className={`${styles.field} ${
              hasChanged("start_gap_percentage") ? styles["field-changed"] : ""
            }`}
            onChange={(e) =>
              setConfig({
                ...config,
                start_gap_percentage: parseFloat(e.target.value),
              })
            }
            name="start_gap_percentage"
            type="number"
            step="0.1"
            value={config.start_gap_percentage}
          />
        </div>

        <div className={styles.fieldContainer}>
          <label>
            Max Weight Alloc.
            <span>🏋️</span>
          </label>
          <input
            disabled={!editing}
            className={`${styles.field} ${
              hasChanged("max_weight_allocation") ? styles["field-changed"] : ""
            }`}
            onChange={(e) =>
              setConfig({
                ...config,
                max_weight_allocation: parseInt(e.target.value),
              })
            }
            name="max_weight_allocation"
            type="number"
            value={config.max_weight_allocation}
          />
        </div>

        <div className={styles.fieldContainer}>
          <label>
            Leverage
            <span>🏌️‍♀️</span>
          </label>
          <input
            disabled={!editing}
            className={`${styles.field} ${
              hasChanged("leverage") ? styles["field-changed"] : ""
            }`}
            onChange={(e) =>
              setConfig({ ...config, leverage: parseInt(e.target.value) })
            }
            name="leverage"
            type="number"
            value={config.leverage}
          />
        </div>
      </div>
    </section>
  );
};

const Users: React.FC<{ users: IUser[] }> = ({ users }) => {
  function handleClickAdd() {
    alert("TODO: Add user");
  }

  return (
    <section className={styles.users}>
      <div className={styles.titleSection}>
        <div className={styles.title}>Users</div>
        <div className={styles.edit} onClick={handleClickAdd}>
          ADD
        </div>
      </div>
      <div className={styles.usersList}>
        {users.map((user) => (
          <User user={user} key={user.id} />
        ))}
      </div>
    </section>
  );
};

const User: React.FC<{ user: IUser }> = ({ user }) => {
  return (
    <div className={styles.User} key={user.id}>
      <div>{user.email}</div>
      <div className={styles.btns}>
        <div className={styles.primary}>logs</div>
        <div className={styles.edit}>edit</div>
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  const res = await fetch(process.env.NEXT_PUBLIC_APP_URL+"/api/config", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Password": process.env.NEXT_PUBLIC_PASSWORD || ""
    },
  });
  const config = await res.json();

  return {
    props: {
      config,
    },
  };
}

export default Home;
