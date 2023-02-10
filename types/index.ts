export interface BotConfig {
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
  };

  export interface IUser {
    _id: string | number;
    email: string;
    ideal_trade_amount: number;
    keys: {
      api_key: string;
      api_secret: string;
    }
  }
  