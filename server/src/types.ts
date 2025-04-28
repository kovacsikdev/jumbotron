export type GameStatsType = {
  gameTime: string;
  score1: number;
  score2: number;
  timeouts1: number;
  timeouts2: number;
  down: number;
  yardsToGo: number;
  quarter: number;
  possession: string;
  ballOn: number;
  videoId: string;
};

export type GameVideoType = {
  id: string;
}

export type RoomType = {
  roomCode: string;
  host: string
  data: GameStatsType;
}