import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import styles from '../styles/Home.module.css'

type BotConfig = {
  pair: string;
  strategy: "reversion" | "tracing-long" | "tracing-short";
  operation_expiry_time: number;
  cci_peak: number;
  stop_loss: number;
  take_profit: number;
  position_structure: string;
  start_gap_percentage: number;
  max_weight_allocation: number;
  leverage: number;
} | null;

const hardCodedConfig: BotConfig = {
  pair: "BTCUSDT",
  strategy: "reversion",
  operation_expiry_time: 2500,
  cci_peak: 250,
  stop_loss: 3,
  take_profit: 2,
  position_structure: "[{'weight': .5}, {'weight': .5}]",
  start_gap_percentage: 1,
  max_weight_allocation: 1,
  leverage: 10,
};

const Home: NextPage = () => {

  const [botConfig, setBotConfig] = useState<BotConfig>(hardCodedConfig);

  return (
    <div className={styles.container}>
      <Head>
        <title>Master of Puppets | BOT</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.status}>
          <div>Status: </div>
          <div>All systems normal</div>
        </div>
        <section>
          <div>
            <BotConfig config={botConfig} setConfig={setBotConfig} />
            <Users />
          </div>
          <div className={styles.statusBar}></div>
        </section>
      </main>

  
    </div>
  )
}

const BotConfig = ({config, setConfig}) => {

  const [editing, setEditing] = useState<boolean>(false);
  const configBeforeEditingStarts = useRef<BotConfig>(config);

  useEffect(() => {
    if (editing) {
      configBeforeEditingStarts.current = config;
    }
  }, [editing]);

  function hasChanged(key) {
    return configBeforeEditingStarts.current[key] !== config[key];
  }

  function somethingChanged() {
    return Object.keys(config).some(hasChanged);
  }

  function canSave() {
    return somethingChanged() && validateData();
  }

  function revertEditing() {
    setConfig(configBeforeEditingStarts.current);
    setEditing(false);
  }

  function positionStructureIsValid(){
    try {
      const positionStructure = eval(config.position_structure);
      return Array.isArray(positionStructure) && positionStructure.every((obj) => obj.weight);
    } catch (e) {
      return false;
    }
  }

  function validateData() {
    return positionStructureIsValid();
  }

  function saveConfig() {
    if (!validateData(config)) {
      alert("Invalid position structure");
      return;
    }
    setEditing(false);
    configBeforeEditingStarts.current = config;
    alert("Saved");
  }

  return (
    <section
        className={`${styles.config} ${editing ? styles['config-editing'] : ''}`}
        >
          <div className={styles.titleSection}>
            <div className={styles.title}>Bot Config</div>
            {editing ? (
              <>
              <div className={styles.btnContainer}>
                <div 
                className={`${styles.save} ${canSave() ? styles['save-valid'] : ''}`}
                onClick={saveConfig}
                >
                  SAVE
                </div>
                <div className={styles.cancel}
                onClick={revertEditing}
                >CANCEL</div>
              </div>
              </>
              
            ) : (
              <div className={styles.edit}
              onClick={() => setEditing(!editing)}
              >EDIT</div>
            )
              }
            
          </div>
          <div className={styles.configList}>
            
            <div className={styles.fieldContainer}>
              <label>Pair 
                <span>💰</span>
              </label>
              <input disabled={!editing} 
              className={`${styles.field} ${hasChanged('pair') ? styles['field-changed'] : ''}`}
              onChange={(e) => setConfig({...config, pair: e.target.value})}
              name="pair" type="text" value={config.pair} />
            </div>
            
            <div className={styles.fieldContainer}>
              <label>Strategy 
                <span>🎯</span>
              </label>
              <select disabled={!editing} 
              className={`${styles.field} ${hasChanged('strategy') ? styles['field-changed'] : ''}`}
              onChange={(e) => setConfig({...config, strategy: e.target.value})}
              name="strategy" value={config.strategy}>
                <option value="reversion">reversion</option>
                <option value="tracing-short">tracing-short</option>
                <option value="tracing-long">tracing-long</option>
              </select>
            </div>
            
            <div className={styles.fieldContainer}>
              <label>Op. Expiry Time 
                <span>⌛</span>
              </label>
              <input disabled={!editing} 
              className={`${styles.field} ${hasChanged('operation_expiry_time') ? styles['field-changed'] : ''}`}
              onChange={(e) => setConfig({...config, operation_expiry_time: parseInt(e.target.value)})}
              name="operation_expiry_time" type="number" value={config.operation_expiry_time} />
            </div>
            
            <div className={styles.fieldContainer}>
              <label>CCI Peak 
                <span>📈</span>
              </label>
              <input disabled={!editing} 
              className={`${styles.field} ${hasChanged('cci_peak') ? styles['field-changed'] : ''}`}
              onChange={(e) => setConfig({...config, cci_peak: parseInt(e.target.value)})}
              type="number" value={config.cci_peak} />
            </div>
            
            <div className={styles.fieldContainer}>
              <label>Stop Loss
                <span>🚫</span>
              </label>
              <input disabled={!editing} 
              className={`${styles.field} ${hasChanged('stop_loss') ? styles['field-changed'] : ''}`}
              onChange={(e) => setConfig({...config, stop_loss: parseInt(e.target.value)})}
              name="stop_loss" type="number" value={config.stop_loss} />
            </div>
            
            <div className={styles.fieldContainer}>
              <label>Take Profit
                <span>💸</span>
              </label>
              <input disabled={!editing} 
              className={`${styles.field} ${hasChanged('take_profit') ? styles['field-changed'] : ''}`}
              onChange={(e) => setConfig({...config, take_profit: parseInt(e.target.value)})}
              name="take_profit" type="number" value={config.take_profit} />
            </div>
            
            <div className={styles.fieldContainer}>
              <label>Position Structure
                <span>🏗️</span>
              </label>
              <input disabled={!editing} 
              className={`${styles.field} ${hasChanged('position_structure') ? styles['field-changed'] : ''} ${!positionStructureIsValid() ? styles['field-invalid'] : ''}`}
              onChange={(e) => setConfig({...config, position_structure: e.target.value})}
              name="position_structure" type="text" value={config.position_structure} />
            </div>
            
            <div className={styles.fieldContainer}>
              <label>Start Gap Percentage
                <span>⏩</span>
              </label>
              <input disabled={!editing} 
              className={`${styles.field} ${hasChanged('start_gap_percentage') ? styles['field-changed'] : ''}`}
              onChange={(e) => setConfig({...config, start_gap_percentage: parseInt(e.target.value)})}
              name="start_gap_percentage" type="number" value={config.start_gap_percentage} />
            </div>
            
            <div className={styles.fieldContainer}>
              <label>Max Weight Allocation
                <span>🏋️</span>
              </label>
              <input disabled={!editing} 
              className={`${styles.field} ${hasChanged('max_weight_allocation') ? styles['field-changed'] : ''}`}
              onChange={(e) => setConfig({...config, max_weight_allocation: parseInt(e.target.value)})}
              name="max_weight_allocation" type="number" value={config.max_weight_allocation} />
            </div>
            
            <div className={styles.fieldContainer}>
              <label>Leverage
                <span>🏌️‍♀️</span>
              </label>
              <input disabled={!editing} 
              className={`${styles.field} ${hasChanged('leverage') ? styles['field-changed'] : ''}`}
              onChange={(e) => setConfig({...config, leverage: parseInt(e.target.value)})}
              name="leverage" type="number" value={config.leverage} />
            </div>
          </div>
        </section>
  )
}

const Users = () => {

  const [editing, setEditing] = useState<boolean>(false);

  return (
    <section
        className={styles.users}
        >
          <div className={styles.titleSection}>
            <div className={styles.title}>Users</div>
            <div className={styles.edit}
              onClick={() => setEditing(!editing)}
              >EDIT</div>
          </div>
        </section>
  )
}

export default Home
