export interface KmdbMovieResult {
  DOCID: string;
  title: string;
  directors: {
    director: { directorNm: string }[];
  };
  repRlsDate: string;
  posters: string;
  stlls: string;
  plots: {
    plot: { plotText: string }[];
  };
  genre: string;
}

export interface KmdbApiResponse {
  Data: {
    Result: KmdbMovieResult[];
  }[];
}
