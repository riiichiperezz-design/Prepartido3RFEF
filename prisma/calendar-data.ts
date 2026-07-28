// Datos del calendario oficial 3ª RFEF Grupo 14 (temporada 2026-2027), extraídos del PDF de la FExF.
export interface CalTeam { name: string; short: string; code: string; city?: string; stadium?: string; pitch?: string; phone?: string; kit?: string; }
export interface CalFixture { md: number; date: string; home: string; away: string; }
export const CAL_TEAMS: CalTeam[] = [
 {
  "name": "U.D. MONTIJO \"A\"",
  "short": "Montijo",
  "code": "1011",
  "city": "Montijo",
  "stadium": "ESTADIO MUNICIPAL DE MONTIJO EMILIO MACARRO RODRIGUEZ",
  "pitch": "Hierba artificial",
  "phone": "679595998",
  "kit": "Camiseta Roja · Pantalón Negro · Medias Negras"
 },
 {
  "name": "ESC.FUT. PUEBLA DE LA CALZADA \"A\"",
  "short": "Puebla de la Calzada",
  "code": "1535",
  "city": "Puebla De La Calzada",
  "stadium": "MUNICIPAL DE PUEBLA DE LA CALZADA",
  "pitch": "Hierba artificial",
  "phone": "924042678",
  "kit": "Camiseta Azul · Pantalón Blanco · Medias Azules"
 },
 {
  "name": "C.D. CABEZA DEL BUEY",
  "short": "Cabeza del Buey",
  "code": "1179",
  "city": "Cabeza Del Buey",
  "stadium": "MUNICIPAL DE CABEZA DEL BUEY",
  "pitch": "Hierba artificial",
  "phone": "669122560",
  "kit": "Camiseta ROJO · Pantalón AZUL MARINO · Medias MARINO"
 },
 {
  "name": "C.D. CASTUERA SUBASTACAR",
  "short": "Castuera",
  "code": "1027",
  "city": "Castuera",
  "stadium": "MUNICIPAL DE CASTUERA MANUEL RUIZ",
  "pitch": "Hierba artificial",
  "phone": "609589342",
  "kit": "Camiseta BLANCA · Pantalón BLANCO · Medias BLANCAS"
 },
 {
  "name": "C.D. AZUAGA",
  "short": "Azuaga",
  "code": "1007",
  "city": "Azuaga",
  "stadium": "ESTADIO MUNICIPAL DE AZUAGA",
  "pitch": "Hierba artificial",
  "phone": "647194691",
  "kit": "Camiseta ROJA/BLANCA · Pantalón Negro · Medias Negras"
 },
 {
  "name": "U.P. PLASENCIA \"A\"",
  "short": "Plasencia",
  "code": "2007",
  "city": "Plasencia",
  "stadium": "CAMPO MUNICIPAL PLASENCIA",
  "pitch": "Hierba artificial",
  "phone": "639624894",
  "kit": "Camiseta Blanca · Pantalón Negro · Medias Blancas"
 },
 {
  "name": "C.D. GUADIANA",
  "short": "Guadiana",
  "code": "1181",
  "city": "Guadiana",
  "stadium": "MUNICIPAL DE GUADIANA DEL CAUDILLO ERNESTO SANCHEZ MILLAN",
  "pitch": "Hierba natural",
  "phone": "924470275",
  "kit": "Camiseta Roja · Pantalón Negro · Medias Negras"
 },
 {
  "name": "C.D. QUINTANA",
  "short": "Quintana",
  "code": "1037",
  "city": "Quintana De La Serena",
  "stadium": "MUNICIPAL DE QUINTANA DE LA SERENA",
  "pitch": "Hierba artificial",
  "phone": "669714695",
  "kit": "Camiseta ROJA · Pantalón AZUL · Medias Rojas"
 },
 {
  "name": "C.F. VILLANOVENSE",
  "short": "Villanovense",
  "code": "1463",
  "city": "Villanueva De La Serena",
  "stadium": "ESTADIO MUNICIPAL VILLANOVENSE",
  "pitch": "Hierba natural",
  "phone": "607221420",
  "kit": "Camiseta Blanca · Pantalón Blanco · Medias VERDES"
 },
 {
  "name": "ATLETICO CLUB PUEBLONUEVO",
  "short": "At. Pueblonuevo",
  "code": "1034",
  "city": "Pueblonuevo Del Guadiana",
  "stadium": "MUNICIPAL DE PUEBLONUEVO DEL GUADIANA ANTONIO AMAYA",
  "pitch": "Hierba natural",
  "phone": "670529846",
  "kit": "Camiseta Roja · Pantalón Azul · Medias Rojas"
 },
 {
  "name": "C.F. JARAIZ \"A\"",
  "short": "Jaraíz",
  "code": "2010",
  "city": "Jaraíz De La Vera",
  "stadium": "POLIDEPORTIVO MUNICIPAL JARAIZ DE LA VERA",
  "phone": "618741466",
  "kit": "Camiseta ROJA · Pantalón AZUL · Medias ROJAS"
 },
 {
  "name": "MORALO C.P. \"A\"",
  "short": "Moralo",
  "code": "2002",
  "city": "Navalmoral De La Mata",
  "stadium": "CAMPO MUNICIPAL NAVALMORAL DE LA MATA",
  "pitch": "Hierba artificial",
  "phone": "649301517",
  "kit": "Camiseta VERDIBLANCA · Pantalón Blanco · Medias VERDE Y BLANCA"
 },
 {
  "name": "C.D. ZAFRA \"A\"",
  "short": "Zafra",
  "code": "1530",
  "city": "Zafra",
  "stadium": "MUNICIPAL DE ZAFRA NUEVO ESTADIO",
  "pitch": "Hierba natural",
  "phone": "684117988",
  "kit": "Camiseta Azul · Pantalón Blanco · Medias Azules"
 },
 {
  "name": "A.D. LLERENENSE \"A\"",
  "short": "Llerenense",
  "code": "1022",
  "city": "Llerena",
  "stadium": "MUNICIPAL DE LLERENA FERNANDO ROBINA",
  "pitch": "Hierba artificial",
  "phone": "652613353",
  "kit": "Camiseta BLANCA · Pantalón BLANCO · Medias Blancas"
 },
 {
  "name": "C.D. SANTA AMALIA \"A\"",
  "short": "Santa Amalia",
  "code": "1031",
  "city": "Santa Amalia",
  "stadium": "MUNICIPAL DE SANTA AMALIA",
  "pitch": "Hierba natural",
  "phone": "656854443",
  "kit": "Camiseta Verde · Pantalón Blanco · Medias Verdes"
 },
 {
  "name": "S.P. VILLAFRANCA \"A\"",
  "short": "Villafranca",
  "code": "1006",
  "city": "Villafranca De Los Barros",
  "stadium": "MUNICIPAL DE VILLAFRANCA DE LOS BARROS",
  "pitch": "Hierba natural",
  "phone": "637841238",
  "kit": "Camiseta Amarilla · Pantalón Azul · Medias Azules"
 },
 {
  "name": "C.D. GEVORA \"A\"",
  "short": "Gévora",
  "code": "1373",
  "city": "Badajoz",
  "stadium": "MUNICIPAL DE GEVORA",
  "pitch": "Hierba artificial",
  "phone": "605698974",
  "kit": "Camiseta VERDE · Pantalón NEGRO · Medias VERDES"
 },
 {
  "name": "JEREZ C.F. \"A\"",
  "short": "Jerez",
  "code": "1040",
  "city": "Jerez De Los Caballeros",
  "stadium": "CIUDAD DEPORTIVA DE JEREZ DE LOS CABALLEROS MANUEL CALZADO -",
  "pitch": "Hierba natural",
  "phone": "650775995",
  "kit": "Camiseta Verde · Pantalón NEGRO · Medias NEGRAS"
 }
];
export const CAL_FIXTURES: CalFixture[] = [{"md":1,"date":"2026-09-06","home":"U.D. MONTIJO \"A\"","away":"C.D. CABEZA DEL BUEY"},{"md":1,"date":"2026-09-06","home":"S.P. VILLAFRANCA \"A\"","away":"C.D. AZUAGA"},{"md":1,"date":"2026-09-06","home":"A.D. LLERENENSE \"A\"","away":"C.D. GUADIANA"},{"md":1,"date":"2026-09-06","home":"MORALO C.P. \"A\"","away":"C.F. VILLANOVENSE"},{"md":1,"date":"2026-09-06","home":"ATLETICO CLUB PUEBLONUEVO","away":"C.F. JARAIZ \"A\""},{"md":1,"date":"2026-09-06","home":"C.D. QUINTANA","away":"C.D. ZAFRA \"A\""},{"md":1,"date":"2026-09-06","home":"U.P. PLASENCIA \"A\"","away":"C.D. SANTA AMALIA \"A\""},{"md":1,"date":"2026-09-06","home":"C.D. CASTUERA SUBASTACAR","away":"C.D. GEVORA \"A\""},{"md":1,"date":"2026-09-06","home":"JEREZ C.F. \"A\"","away":"ESC.FUT. PUEBLA DE LA CALZADA \"A\""},{"md":2,"date":"2026-09-13","home":"C.D. CABEZA DEL BUEY","away":"JEREZ C.F. \"A\""},{"md":2,"date":"2026-09-13","home":"C.D. AZUAGA","away":"U.D. MONTIJO \"A\""},{"md":2,"date":"2026-09-13","home":"C.D. GUADIANA","away":"S.P. VILLAFRANCA \"A\""},{"md":2,"date":"2026-09-13","home":"C.F. VILLANOVENSE","away":"A.D. LLERENENSE \"A\""},{"md":2,"date":"2026-09-13","home":"C.F. JARAIZ \"A\"","away":"MORALO C.P. \"A\""},{"md":2,"date":"2026-09-13","home":"C.D. ZAFRA \"A\"","away":"ATLETICO CLUB PUEBLONUEVO"},{"md":2,"date":"2026-09-13","home":"C.D. SANTA AMALIA \"A\"","away":"C.D. QUINTANA"},{"md":2,"date":"2026-09-13","home":"C.D. GEVORA \"A\"","away":"U.P. PLASENCIA \"A\""},{"md":2,"date":"2026-09-13","home":"ESC.FUT. PUEBLA DE LA CALZADA \"A\"","away":"C.D. CASTUERA SUBASTACAR"},{"md":3,"date":"2026-09-20","home":"C.D. CABEZA DEL BUEY","away":"C.D. AZUAGA"},{"md":3,"date":"2026-09-20","home":"U.D. MONTIJO \"A\"","away":"C.D. GUADIANA"},{"md":3,"date":"2026-09-20","home":"S.P. VILLAFRANCA \"A\"","away":"C.F. VILLANOVENSE"},{"md":3,"date":"2026-09-20","home":"A.D. LLERENENSE \"A\"","away":"C.F. JARAIZ \"A\""},{"md":3,"date":"2026-09-20","home":"MORALO C.P. \"A\"","away":"C.D. ZAFRA \"A\""},{"md":3,"date":"2026-09-20","home":"ATLETICO CLUB PUEBLONUEVO","away":"C.D. SANTA AMALIA \"A\""},{"md":3,"date":"2026-09-20","home":"C.D. QUINTANA","away":"C.D. GEVORA \"A\""},{"md":3,"date":"2026-09-20","home":"U.P. PLASENCIA \"A\"","away":"ESC.FUT. PUEBLA DE LA CALZADA \"A\""},{"md":3,"date":"2026-09-20","home":"JEREZ C.F. \"A\"","away":"C.D. CASTUERA SUBASTACAR"},{"md":4,"date":"2026-09-27","home":"C.D. AZUAGA","away":"JEREZ C.F. \"A\""},{"md":4,"date":"2026-09-27","home":"C.D. GUADIANA","away":"C.D. CABEZA DEL BUEY"},{"md":4,"date":"2026-09-27","home":"C.F. VILLANOVENSE","away":"U.D. MONTIJO \"A\""},{"md":4,"date":"2026-09-27","home":"C.F. JARAIZ \"A\"","away":"S.P. VILLAFRANCA \"A\""},{"md":4,"date":"2026-09-27","home":"C.D. ZAFRA \"A\"","away":"A.D. LLERENENSE \"A\""},{"md":4,"date":"2026-09-27","home":"C.D. SANTA AMALIA \"A\"","away":"MORALO C.P. \"A\""},{"md":4,"date":"2026-09-27","home":"C.D. GEVORA \"A\"","away":"ATLETICO CLUB PUEBLONUEVO"},{"md":4,"date":"2026-09-27","home":"ESC.FUT. PUEBLA DE LA CALZADA \"A\"","away":"C.D. QUINTANA"},{"md":4,"date":"2026-09-27","home":"C.D. CASTUERA SUBASTACAR","away":"U.P. PLASENCIA \"A\""},{"md":5,"date":"2026-10-04","home":"C.D. AZUAGA","away":"C.D. GUADIANA"},{"md":5,"date":"2026-10-04","home":"C.D. CABEZA DEL BUEY","away":"C.F. VILLANOVENSE"},{"md":5,"date":"2026-10-04","home":"U.D. MONTIJO \"A\"","away":"C.F. JARAIZ \"A\""},{"md":5,"date":"2026-10-04","home":"S.P. VILLAFRANCA \"A\"","away":"C.D. ZAFRA \"A\""},{"md":5,"date":"2026-10-04","home":"A.D. LLERENENSE \"A\"","away":"C.D. SANTA AMALIA \"A\""},{"md":5,"date":"2026-10-04","home":"MORALO C.P. \"A\"","away":"C.D. GEVORA \"A\""},{"md":5,"date":"2026-10-04","home":"ATLETICO CLUB PUEBLONUEVO","away":"ESC.FUT. PUEBLA DE LA CALZADA \"A\""},{"md":5,"date":"2026-10-04","home":"C.D. QUINTANA","away":"C.D. CASTUERA SUBASTACAR"},{"md":5,"date":"2026-10-04","home":"JEREZ C.F. \"A\"","away":"U.P. PLASENCIA \"A\""},{"md":6,"date":"2026-10-11","home":"C.D. GUADIANA","away":"JEREZ C.F. \"A\""},{"md":6,"date":"2026-10-11","home":"C.F. VILLANOVENSE","away":"C.D. AZUAGA"},{"md":6,"date":"2026-10-11","home":"C.F. JARAIZ \"A\"","away":"C.D. CABEZA DEL BUEY"},{"md":6,"date":"2026-10-11","home":"C.D. ZAFRA \"A\"","away":"U.D. MONTIJO \"A\""},{"md":6,"date":"2026-10-11","home":"C.D. SANTA AMALIA \"A\"","away":"S.P. VILLAFRANCA \"A\""},{"md":6,"date":"2026-10-11","home":"C.D. GEVORA \"A\"","away":"A.D. LLERENENSE \"A\""},{"md":6,"date":"2026-10-11","home":"ESC.FUT. PUEBLA DE LA CALZADA \"A\"","away":"MORALO C.P. \"A\""},{"md":6,"date":"2026-10-11","home":"C.D. CASTUERA SUBASTACAR","away":"ATLETICO CLUB PUEBLONUEVO"},{"md":6,"date":"2026-10-11","home":"U.P. PLASENCIA \"A\"","away":"C.D. QUINTANA"},{"md":7,"date":"2026-10-18","home":"C.D. GUADIANA","away":"C.F. VILLANOVENSE"},{"md":7,"date":"2026-10-18","home":"C.D. AZUAGA","away":"C.F. JARAIZ \"A\""},{"md":7,"date":"2026-10-18","home":"C.D. CABEZA DEL BUEY","away":"C.D. ZAFRA \"A\""},{"md":7,"date":"2026-10-18","home":"U.D. MONTIJO \"A\"","away":"C.D. SANTA AMALIA \"A\""},{"md":7,"date":"2026-10-18","home":"S.P. VILLAFRANCA \"A\"","away":"C.D. GEVORA \"A\""},{"md":7,"date":"2026-10-18","home":"A.D. LLERENENSE \"A\"","away":"ESC.FUT. PUEBLA DE LA CALZADA \"A\""},{"md":7,"date":"2026-10-18","home":"MORALO C.P. \"A\"","away":"C.D. CASTUERA SUBASTACAR"},{"md":7,"date":"2026-10-18","home":"ATLETICO CLUB PUEBLONUEVO","away":"U.P. PLASENCIA \"A\""},{"md":7,"date":"2026-10-18","home":"JEREZ C.F. \"A\"","away":"C.D. QUINTANA"},{"md":8,"date":"2026-10-25","home":"C.F. VILLANOVENSE","away":"JEREZ C.F. \"A\""},{"md":8,"date":"2026-10-25","home":"C.F. JARAIZ \"A\"","away":"C.D. GUADIANA"},{"md":8,"date":"2026-10-25","home":"C.D. ZAFRA \"A\"","away":"C.D. AZUAGA"},{"md":8,"date":"2026-10-25","home":"C.D. SANTA AMALIA \"A\"","away":"C.D. CABEZA DEL BUEY"},{"md":8,"date":"2026-10-25","home":"C.D. GEVORA \"A\"","away":"U.D. MONTIJO \"A\""},{"md":8,"date":"2026-10-25","home":"ESC.FUT. PUEBLA DE LA CALZADA \"A\"","away":"S.P. VILLAFRANCA \"A\""},{"md":8,"date":"2026-10-25","home":"C.D. CASTUERA SUBASTACAR","away":"A.D. LLERENENSE \"A\""},{"md":8,"date":"2026-10-25","home":"U.P. PLASENCIA \"A\"","away":"MORALO C.P. \"A\""},{"md":8,"date":"2026-10-25","home":"C.D. QUINTANA","away":"ATLETICO CLUB PUEBLONUEVO"},{"md":9,"date":"2026-11-01","home":"C.F. VILLANOVENSE","away":"C.F. JARAIZ \"A\""},{"md":9,"date":"2026-11-01","home":"C.D. GUADIANA","away":"C.D. ZAFRA \"A\""},{"md":9,"date":"2026-11-01","home":"C.D. AZUAGA","away":"C.D. SANTA AMALIA \"A\""},{"md":9,"date":"2026-11-01","home":"C.D. CABEZA DEL BUEY","away":"C.D. GEVORA \"A\""},{"md":9,"date":"2026-11-01","home":"U.D. MONTIJO \"A\"","away":"ESC.FUT. PUEBLA DE LA CALZADA \"A\""},{"md":9,"date":"2026-11-01","home":"S.P. VILLAFRANCA \"A\"","away":"C.D. CASTUERA SUBASTACAR"},{"md":9,"date":"2026-11-01","home":"A.D. LLERENENSE \"A\"","away":"U.P. PLASENCIA \"A\""},{"md":9,"date":"2026-11-01","home":"MORALO C.P. \"A\"","away":"C.D. QUINTANA"},{"md":9,"date":"2026-11-01","home":"JEREZ C.F. \"A\"","away":"ATLETICO CLUB PUEBLONUEVO"},{"md":10,"date":"2026-11-08","home":"C.F. JARAIZ \"A\"","away":"JEREZ C.F. \"A\""},{"md":10,"date":"2026-11-08","home":"C.D. ZAFRA \"A\"","away":"C.F. VILLANOVENSE"},{"md":10,"date":"2026-11-08","home":"C.D. SANTA AMALIA \"A\"","away":"C.D. GUADIANA"},{"md":10,"date":"2026-11-08","home":"C.D. GEVORA \"A\"","away":"C.D. AZUAGA"},{"md":10,"date":"2026-11-08","home":"ESC.FUT. PUEBLA DE LA CALZADA \"A\"","away":"C.D. CABEZA DEL BUEY"},{"md":10,"date":"2026-11-08","home":"C.D. CASTUERA SUBASTACAR","away":"U.D. MONTIJO \"A\""},{"md":10,"date":"2026-11-08","home":"U.P. PLASENCIA \"A\"","away":"S.P. VILLAFRANCA \"A\""},{"md":10,"date":"2026-11-08","home":"C.D. QUINTANA","away":"A.D. LLERENENSE \"A\""},{"md":10,"date":"2026-11-08","home":"ATLETICO CLUB PUEBLONUEVO","away":"MORALO C.P. \"A\""},{"md":11,"date":"2026-11-15","home":"C.F. JARAIZ \"A\"","away":"C.D. ZAFRA \"A\""},{"md":11,"date":"2026-11-15","home":"C.F. VILLANOVENSE","away":"C.D. SANTA AMALIA \"A\""},{"md":11,"date":"2026-11-15","home":"C.D. GUADIANA","away":"C.D. GEVORA \"A\""},{"md":11,"date":"2026-11-15","home":"C.D. AZUAGA","away":"ESC.FUT. PUEBLA DE LA CALZADA \"A\""},{"md":11,"date":"2026-11-15","home":"C.D. CABEZA DEL BUEY","away":"C.D. CASTUERA SUBASTACAR"},{"md":11,"date":"2026-11-15","home":"U.D. MONTIJO \"A\"","away":"U.P. PLASENCIA \"A\""},{"md":11,"date":"2026-11-15","home":"S.P. VILLAFRANCA \"A\"","away":"C.D. QUINTANA"},{"md":11,"date":"2026-11-15","home":"A.D. LLERENENSE \"A\"","away":"ATLETICO CLUB PUEBLONUEVO"},{"md":11,"date":"2026-11-15","home":"JEREZ C.F. \"A\"","away":"MORALO C.P. \"A\""},{"md":12,"date":"2026-11-22","home":"C.D. ZAFRA \"A\"","away":"JEREZ C.F. \"A\""},{"md":12,"date":"2026-11-22","home":"C.D. SANTA AMALIA \"A\"","away":"C.F. JARAIZ \"A\""},{"md":12,"date":"2026-11-22","home":"C.D. GEVORA \"A\"","away":"C.F. VILLANOVENSE"},{"md":12,"date":"2026-11-22","home":"ESC.FUT. PUEBLA DE LA CALZADA \"A\"","away":"C.D. GUADIANA"},{"md":12,"date":"2026-11-22","home":"C.D. CASTUERA SUBASTACAR","away":"C.D. AZUAGA"},{"md":12,"date":"2026-11-22","home":"U.P. PLASENCIA \"A\"","away":"C.D. CABEZA DEL BUEY"},{"md":12,"date":"2026-11-22","home":"C.D. QUINTANA","away":"U.D. MONTIJO \"A\""},{"md":12,"date":"2026-11-22","home":"ATLETICO CLUB PUEBLONUEVO","away":"S.P. VILLAFRANCA \"A\""},{"md":12,"date":"2026-11-22","home":"MORALO C.P. \"A\"","away":"A.D. LLERENENSE \"A\""},{"md":13,"date":"2026-11-29","home":"C.D. ZAFRA \"A\"","away":"C.D. SANTA AMALIA \"A\""},{"md":13,"date":"2026-11-29","home":"C.F. JARAIZ \"A\"","away":"C.D. GEVORA \"A\""},{"md":13,"date":"2026-11-29","home":"C.F. VILLANOVENSE","away":"ESC.FUT. PUEBLA DE LA CALZADA \"A\""},{"md":13,"date":"2026-11-29","home":"C.D. GUADIANA","away":"C.D. CASTUERA SUBASTACAR"},{"md":13,"date":"2026-11-29","home":"C.D. AZUAGA","away":"U.P. PLASENCIA \"A\""},{"md":13,"date":"2026-11-29","home":"C.D. CABEZA DEL BUEY","away":"C.D. QUINTANA"},{"md":13,"date":"2026-11-29","home":"U.D. MONTIJO \"A\"","away":"ATLETICO CLUB PUEBLONUEVO"},{"md":13,"date":"2026-11-29","home":"S.P. VILLAFRANCA \"A\"","away":"MORALO C.P. \"A\""},{"md":13,"date":"2026-11-29","home":"JEREZ C.F. \"A\"","away":"A.D. LLERENENSE \"A\""},{"md":14,"date":"2026-12-06","home":"C.D. SANTA AMALIA \"A\"","away":"JEREZ C.F. \"A\""},{"md":14,"date":"2026-12-06","home":"C.D. GEVORA \"A\"","away":"C.D. ZAFRA \"A\""},{"md":14,"date":"2026-12-06","home":"ESC.FUT. PUEBLA DE LA CALZADA \"A\"","away":"C.F. JARAIZ \"A\""},{"md":14,"date":"2026-12-06","home":"C.D. CASTUERA SUBASTACAR","away":"C.F. VILLANOVENSE"},{"md":14,"date":"2026-12-06","home":"U.P. PLASENCIA \"A\"","away":"C.D. GUADIANA"},{"md":14,"date":"2026-12-06","home":"C.D. QUINTANA","away":"C.D. AZUAGA"},{"md":14,"date":"2026-12-06","home":"ATLETICO CLUB PUEBLONUEVO","away":"C.D. CABEZA DEL BUEY"},{"md":14,"date":"2026-12-06","home":"MORALO C.P. \"A\"","away":"U.D. MONTIJO \"A\""},{"md":14,"date":"2026-12-06","home":"A.D. LLERENENSE \"A\"","away":"S.P. VILLAFRANCA \"A\""},{"md":15,"date":"2026-12-13","home":"C.D. SANTA AMALIA \"A\"","away":"C.D. GEVORA \"A\""},{"md":15,"date":"2026-12-13","home":"C.D. ZAFRA \"A\"","away":"ESC.FUT. PUEBLA DE LA CALZADA \"A\""},{"md":15,"date":"2026-12-13","home":"C.F. JARAIZ \"A\"","away":"C.D. CASTUERA SUBASTACAR"},{"md":15,"date":"2026-12-13","home":"C.F. VILLANOVENSE","away":"U.P. PLASENCIA \"A\""},{"md":15,"date":"2026-12-13","home":"C.D. GUADIANA","away":"C.D. QUINTANA"},{"md":15,"date":"2026-12-13","home":"C.D. AZUAGA","away":"ATLETICO CLUB PUEBLONUEVO"},{"md":15,"date":"2026-12-13","home":"C.D. CABEZA DEL BUEY","away":"MORALO C.P. \"A\""},{"md":15,"date":"2026-12-13","home":"U.D. MONTIJO \"A\"","away":"A.D. LLERENENSE \"A\""},{"md":15,"date":"2026-12-13","home":"JEREZ C.F. \"A\"","away":"S.P. VILLAFRANCA \"A\""},{"md":16,"date":"2026-12-20","home":"JEREZ C.F. \"A\"","away":"C.D. GEVORA \"A\""},{"md":16,"date":"2026-12-20","home":"ESC.FUT. PUEBLA DE LA CALZADA \"A\"","away":"C.D. SANTA AMALIA \"A\""},{"md":16,"date":"2026-12-20","home":"C.D. CASTUERA SUBASTACAR","away":"C.D. ZAFRA \"A\""},{"md":16,"date":"2026-12-20","home":"U.P. PLASENCIA \"A\"","away":"C.F. JARAIZ \"A\""},{"md":16,"date":"2026-12-20","home":"C.D. QUINTANA","away":"C.F. VILLANOVENSE"},{"md":16,"date":"2026-12-20","home":"ATLETICO CLUB PUEBLONUEVO","away":"C.D. GUADIANA"},{"md":16,"date":"2026-12-20","home":"MORALO C.P. \"A\"","away":"C.D. AZUAGA"},{"md":16,"date":"2026-12-20","home":"A.D. LLERENENSE \"A\"","away":"C.D. CABEZA DEL BUEY"},{"md":16,"date":"2026-12-20","home":"S.P. VILLAFRANCA \"A\"","away":"U.D. MONTIJO \"A\""},{"md":17,"date":"2027-01-10","home":"C.D. GEVORA \"A\"","away":"ESC.FUT. PUEBLA DE LA CALZADA \"A\""},{"md":17,"date":"2027-01-10","home":"C.D. SANTA AMALIA \"A\"","away":"C.D. CASTUERA SUBASTACAR"},{"md":17,"date":"2027-01-10","home":"C.D. ZAFRA \"A\"","away":"U.P. PLASENCIA \"A\""},{"md":17,"date":"2027-01-10","home":"C.F. JARAIZ \"A\"","away":"C.D. QUINTANA"},{"md":17,"date":"2027-01-10","home":"C.F. VILLANOVENSE","away":"ATLETICO CLUB PUEBLONUEVO"},{"md":17,"date":"2027-01-10","home":"C.D. GUADIANA","away":"MORALO C.P. \"A\""},{"md":17,"date":"2027-01-10","home":"C.D. AZUAGA","away":"A.D. LLERENENSE \"A\""},{"md":17,"date":"2027-01-10","home":"C.D. CABEZA DEL BUEY","away":"S.P. VILLAFRANCA \"A\""},{"md":17,"date":"2027-01-10","home":"U.D. MONTIJO \"A\"","away":"JEREZ C.F. \"A\""},{"md":18,"date":"2027-01-17","home":"C.D. CABEZA DEL BUEY","away":"U.D. MONTIJO \"A\""},{"md":18,"date":"2027-01-17","home":"C.D. AZUAGA","away":"S.P. VILLAFRANCA \"A\""},{"md":18,"date":"2027-01-17","home":"C.D. GUADIANA","away":"A.D. LLERENENSE \"A\""},{"md":18,"date":"2027-01-17","home":"C.F. VILLANOVENSE","away":"MORALO C.P. \"A\""},{"md":18,"date":"2027-01-17","home":"C.F. JARAIZ \"A\"","away":"ATLETICO CLUB PUEBLONUEVO"},{"md":18,"date":"2027-01-17","home":"C.D. ZAFRA \"A\"","away":"C.D. QUINTANA"},{"md":18,"date":"2027-01-17","home":"C.D. SANTA AMALIA \"A\"","away":"U.P. PLASENCIA \"A\""},{"md":18,"date":"2027-01-17","home":"C.D. GEVORA \"A\"","away":"C.D. CASTUERA SUBASTACAR"},{"md":18,"date":"2027-01-17","home":"ESC.FUT. PUEBLA DE LA CALZADA \"A\"","away":"JEREZ C.F. \"A\""},{"md":19,"date":"2027-01-24","home":"JEREZ C.F. \"A\"","away":"C.D. CABEZA DEL BUEY"},{"md":19,"date":"2027-01-24","home":"U.D. MONTIJO \"A\"","away":"C.D. AZUAGA"},{"md":19,"date":"2027-01-24","home":"S.P. VILLAFRANCA \"A\"","away":"C.D. GUADIANA"},{"md":19,"date":"2027-01-24","home":"A.D. LLERENENSE \"A\"","away":"C.F. VILLANOVENSE"},{"md":19,"date":"2027-01-24","home":"MORALO C.P. \"A\"","away":"C.F. JARAIZ \"A\""},{"md":19,"date":"2027-01-24","home":"ATLETICO CLUB PUEBLONUEVO","away":"C.D. ZAFRA \"A\""},{"md":19,"date":"2027-01-24","home":"C.D. QUINTANA","away":"C.D. SANTA AMALIA \"A\""},{"md":19,"date":"2027-01-24","home":"U.P. PLASENCIA \"A\"","away":"C.D. GEVORA \"A\""},{"md":19,"date":"2027-01-24","home":"C.D. CASTUERA SUBASTACAR","away":"ESC.FUT. PUEBLA DE LA CALZADA \"A\""},{"md":20,"date":"2027-01-31","home":"C.D. AZUAGA","away":"C.D. CABEZA DEL BUEY"},{"md":20,"date":"2027-01-31","home":"C.D. GUADIANA","away":"U.D. MONTIJO \"A\""},{"md":20,"date":"2027-01-31","home":"C.F. VILLANOVENSE","away":"S.P. VILLAFRANCA \"A\""},{"md":20,"date":"2027-01-31","home":"C.F. JARAIZ \"A\"","away":"A.D. LLERENENSE \"A\""},{"md":20,"date":"2027-01-31","home":"C.D. ZAFRA \"A\"","away":"MORALO C.P. \"A\""},{"md":20,"date":"2027-01-31","home":"C.D. SANTA AMALIA \"A\"","away":"ATLETICO CLUB PUEBLONUEVO"},{"md":20,"date":"2027-01-31","home":"C.D. GEVORA \"A\"","away":"C.D. QUINTANA"},{"md":20,"date":"2027-01-31","home":"ESC.FUT. PUEBLA DE LA CALZADA \"A\"","away":"U.P. PLASENCIA \"A\""},{"md":20,"date":"2027-01-31","home":"C.D. CASTUERA SUBASTACAR","away":"JEREZ C.F. \"A\""},{"md":21,"date":"2027-02-07","home":"JEREZ C.F. \"A\"","away":"C.D. AZUAGA"},{"md":21,"date":"2027-02-07","home":"C.D. CABEZA DEL BUEY","away":"C.D. GUADIANA"},{"md":21,"date":"2027-02-07","home":"U.D. MONTIJO \"A\"","away":"C.F. VILLANOVENSE"},{"md":21,"date":"2027-02-07","home":"S.P. VILLAFRANCA \"A\"","away":"C.F. JARAIZ \"A\""},{"md":21,"date":"2027-02-07","home":"A.D. LLERENENSE \"A\"","away":"C.D. ZAFRA \"A\""},{"md":21,"date":"2027-02-07","home":"MORALO C.P. \"A\"","away":"C.D. SANTA AMALIA \"A\""},{"md":21,"date":"2027-02-07","home":"ATLETICO CLUB PUEBLONUEVO","away":"C.D. GEVORA \"A\""},{"md":21,"date":"2027-02-07","home":"C.D. QUINTANA","away":"ESC.FUT. PUEBLA DE LA CALZADA \"A\""},{"md":21,"date":"2027-02-07","home":"U.P. PLASENCIA \"A\"","away":"C.D. CASTUERA SUBASTACAR"},{"md":22,"date":"2027-02-14","home":"C.D. GUADIANA","away":"C.D. AZUAGA"},{"md":22,"date":"2027-02-14","home":"C.F. VILLANOVENSE","away":"C.D. CABEZA DEL BUEY"},{"md":22,"date":"2027-02-14","home":"C.F. JARAIZ \"A\"","away":"U.D. MONTIJO \"A\""},{"md":22,"date":"2027-02-14","home":"C.D. ZAFRA \"A\"","away":"S.P. VILLAFRANCA \"A\""},{"md":22,"date":"2027-02-14","home":"C.D. SANTA AMALIA \"A\"","away":"A.D. LLERENENSE \"A\""},{"md":22,"date":"2027-02-14","home":"C.D. GEVORA \"A\"","away":"MORALO C.P. \"A\""},{"md":22,"date":"2027-02-14","home":"ESC.FUT. PUEBLA DE LA CALZADA \"A\"","away":"ATLETICO CLUB PUEBLONUEVO"},{"md":22,"date":"2027-02-14","home":"C.D. CASTUERA SUBASTACAR","away":"C.D. QUINTANA"},{"md":22,"date":"2027-02-14","home":"U.P. PLASENCIA \"A\"","away":"JEREZ C.F. \"A\""},{"md":23,"date":"2027-02-21","home":"JEREZ C.F. \"A\"","away":"C.D. GUADIANA"},{"md":23,"date":"2027-02-21","home":"C.D. AZUAGA","away":"C.F. VILLANOVENSE"},{"md":23,"date":"2027-02-21","home":"C.D. CABEZA DEL BUEY","away":"C.F. JARAIZ \"A\""},{"md":23,"date":"2027-02-21","home":"U.D. MONTIJO \"A\"","away":"C.D. ZAFRA \"A\""},{"md":23,"date":"2027-02-21","home":"S.P. VILLAFRANCA \"A\"","away":"C.D. SANTA AMALIA \"A\""},{"md":23,"date":"2027-02-21","home":"A.D. LLERENENSE \"A\"","away":"C.D. GEVORA \"A\""},{"md":23,"date":"2027-02-21","home":"MORALO C.P. \"A\"","away":"ESC.FUT. PUEBLA DE LA CALZADA \"A\""},{"md":23,"date":"2027-02-21","home":"ATLETICO CLUB PUEBLONUEVO","away":"C.D. CASTUERA SUBASTACAR"},{"md":23,"date":"2027-02-21","home":"C.D. QUINTANA","away":"U.P. PLASENCIA \"A\""},{"md":24,"date":"2027-02-28","home":"C.F. VILLANOVENSE","away":"C.D. GUADIANA"},{"md":24,"date":"2027-02-28","home":"C.F. JARAIZ \"A\"","away":"C.D. AZUAGA"},{"md":24,"date":"2027-02-28","home":"C.D. ZAFRA \"A\"","away":"C.D. CABEZA DEL BUEY"},{"md":24,"date":"2027-02-28","home":"C.D. SANTA AMALIA \"A\"","away":"U.D. MONTIJO \"A\""},{"md":24,"date":"2027-02-28","home":"C.D. GEVORA \"A\"","away":"S.P. VILLAFRANCA \"A\""},{"md":24,"date":"2027-02-28","home":"ESC.FUT. PUEBLA DE LA CALZADA \"A\"","away":"A.D. LLERENENSE \"A\""},{"md":24,"date":"2027-02-28","home":"C.D. CASTUERA SUBASTACAR","away":"MORALO C.P. \"A\""},{"md":24,"date":"2027-02-28","home":"U.P. PLASENCIA \"A\"","away":"ATLETICO CLUB PUEBLONUEVO"},{"md":24,"date":"2027-02-28","home":"C.D. QUINTANA","away":"JEREZ C.F. \"A\""},{"md":25,"date":"2027-03-07","home":"JEREZ C.F. \"A\"","away":"C.F. VILLANOVENSE"},{"md":25,"date":"2027-03-07","home":"C.D. GUADIANA","away":"C.F. JARAIZ \"A\""},{"md":25,"date":"2027-03-07","home":"C.D. AZUAGA","away":"C.D. ZAFRA \"A\""},{"md":25,"date":"2027-03-07","home":"C.D. CABEZA DEL BUEY","away":"C.D. SANTA AMALIA \"A\""},{"md":25,"date":"2027-03-07","home":"U.D. MONTIJO \"A\"","away":"C.D. GEVORA \"A\""},{"md":25,"date":"2027-03-07","home":"S.P. VILLAFRANCA \"A\"","away":"ESC.FUT. PUEBLA DE LA CALZADA \"A\""},{"md":25,"date":"2027-03-07","home":"A.D. LLERENENSE \"A\"","away":"C.D. CASTUERA SUBASTACAR"},{"md":25,"date":"2027-03-07","home":"MORALO C.P. \"A\"","away":"U.P. PLASENCIA \"A\""},{"md":25,"date":"2027-03-07","home":"ATLETICO CLUB PUEBLONUEVO","away":"C.D. QUINTANA"},{"md":26,"date":"2027-03-14","home":"C.F. JARAIZ \"A\"","away":"C.F. VILLANOVENSE"},{"md":26,"date":"2027-03-14","home":"C.D. ZAFRA \"A\"","away":"C.D. GUADIANA"},{"md":26,"date":"2027-03-14","home":"C.D. SANTA AMALIA \"A\"","away":"C.D. AZUAGA"},{"md":26,"date":"2027-03-14","home":"C.D. GEVORA \"A\"","away":"C.D. CABEZA DEL BUEY"},{"md":26,"date":"2027-03-14","home":"ESC.FUT. PUEBLA DE LA CALZADA \"A\"","away":"U.D. MONTIJO \"A\""},{"md":26,"date":"2027-03-14","home":"C.D. CASTUERA SUBASTACAR","away":"S.P. VILLAFRANCA \"A\""},{"md":26,"date":"2027-03-14","home":"U.P. PLASENCIA \"A\"","away":"A.D. LLERENENSE \"A\""},{"md":26,"date":"2027-03-14","home":"C.D. QUINTANA","away":"MORALO C.P. \"A\""},{"md":26,"date":"2027-03-14","home":"ATLETICO CLUB PUEBLONUEVO","away":"JEREZ C.F. \"A\""},{"md":27,"date":"2027-03-21","home":"JEREZ C.F. \"A\"","away":"C.F. JARAIZ \"A\""},{"md":27,"date":"2027-03-21","home":"C.F. VILLANOVENSE","away":"C.D. ZAFRA \"A\""},{"md":27,"date":"2027-03-21","home":"C.D. GUADIANA","away":"C.D. SANTA AMALIA \"A\""},{"md":27,"date":"2027-03-21","home":"C.D. AZUAGA","away":"C.D. GEVORA \"A\""},{"md":27,"date":"2027-03-21","home":"C.D. CABEZA DEL BUEY","away":"ESC.FUT. PUEBLA DE LA CALZADA \"A\""},{"md":27,"date":"2027-03-21","home":"U.D. MONTIJO \"A\"","away":"C.D. CASTUERA SUBASTACAR"},{"md":27,"date":"2027-03-21","home":"S.P. VILLAFRANCA \"A\"","away":"U.P. PLASENCIA \"A\""},{"md":27,"date":"2027-03-21","home":"A.D. LLERENENSE \"A\"","away":"C.D. QUINTANA"},{"md":27,"date":"2027-03-21","home":"MORALO C.P. \"A\"","away":"ATLETICO CLUB PUEBLONUEVO"},{"md":28,"date":"2027-03-28","home":"C.D. ZAFRA \"A\"","away":"C.F. JARAIZ \"A\""},{"md":28,"date":"2027-03-28","home":"C.D. SANTA AMALIA \"A\"","away":"C.F. VILLANOVENSE"},{"md":28,"date":"2027-03-28","home":"C.D. GEVORA \"A\"","away":"C.D. GUADIANA"},{"md":28,"date":"2027-03-28","home":"ESC.FUT. PUEBLA DE LA CALZADA \"A\"","away":"C.D. AZUAGA"},{"md":28,"date":"2027-03-28","home":"C.D. CASTUERA SUBASTACAR","away":"C.D. CABEZA DEL BUEY"},{"md":28,"date":"2027-03-28","home":"U.P. PLASENCIA \"A\"","away":"U.D. MONTIJO \"A\""},{"md":28,"date":"2027-03-28","home":"C.D. QUINTANA","away":"S.P. VILLAFRANCA \"A\""},{"md":28,"date":"2027-03-28","home":"ATLETICO CLUB PUEBLONUEVO","away":"A.D. LLERENENSE \"A\""},{"md":28,"date":"2027-03-28","home":"MORALO C.P. \"A\"","away":"JEREZ C.F. \"A\""},{"md":29,"date":"2027-04-04","home":"JEREZ C.F. \"A\"","away":"C.D. ZAFRA \"A\""},{"md":29,"date":"2027-04-04","home":"C.F. JARAIZ \"A\"","away":"C.D. SANTA AMALIA \"A\""},{"md":29,"date":"2027-04-04","home":"C.F. VILLANOVENSE","away":"C.D. GEVORA \"A\""},{"md":29,"date":"2027-04-04","home":"C.D. GUADIANA","away":"ESC.FUT. PUEBLA DE LA CALZADA \"A\""},{"md":29,"date":"2027-04-04","home":"C.D. AZUAGA","away":"C.D. CASTUERA SUBASTACAR"},{"md":29,"date":"2027-04-04","home":"C.D. CABEZA DEL BUEY","away":"U.P. PLASENCIA \"A\""},{"md":29,"date":"2027-04-04","home":"U.D. MONTIJO \"A\"","away":"C.D. QUINTANA"},{"md":29,"date":"2027-04-04","home":"S.P. VILLAFRANCA \"A\"","away":"ATLETICO CLUB PUEBLONUEVO"},{"md":29,"date":"2027-04-04","home":"A.D. LLERENENSE \"A\"","away":"MORALO C.P. \"A\""},{"md":30,"date":"2027-04-11","home":"C.D. SANTA AMALIA \"A\"","away":"C.D. ZAFRA \"A\""},{"md":30,"date":"2027-04-11","home":"C.D. GEVORA \"A\"","away":"C.F. JARAIZ \"A\""},{"md":30,"date":"2027-04-11","home":"ESC.FUT. PUEBLA DE LA CALZADA \"A\"","away":"C.F. VILLANOVENSE"},{"md":30,"date":"2027-04-11","home":"C.D. CASTUERA SUBASTACAR","away":"C.D. GUADIANA"},{"md":30,"date":"2027-04-11","home":"U.P. PLASENCIA \"A\"","away":"C.D. AZUAGA"},{"md":30,"date":"2027-04-11","home":"C.D. QUINTANA","away":"C.D. CABEZA DEL BUEY"},{"md":30,"date":"2027-04-11","home":"ATLETICO CLUB PUEBLONUEVO","away":"U.D. MONTIJO \"A\""},{"md":30,"date":"2027-04-11","home":"MORALO C.P. \"A\"","away":"S.P. VILLAFRANCA \"A\""},{"md":30,"date":"2027-04-11","home":"A.D. LLERENENSE \"A\"","away":"JEREZ C.F. \"A\""},{"md":31,"date":"2027-04-18","home":"JEREZ C.F. \"A\"","away":"C.D. SANTA AMALIA \"A\""},{"md":31,"date":"2027-04-18","home":"C.D. ZAFRA \"A\"","away":"C.D. GEVORA \"A\""},{"md":31,"date":"2027-04-18","home":"C.F. JARAIZ \"A\"","away":"ESC.FUT. PUEBLA DE LA CALZADA \"A\""},{"md":31,"date":"2027-04-18","home":"C.F. VILLANOVENSE","away":"C.D. CASTUERA SUBASTACAR"},{"md":31,"date":"2027-04-18","home":"C.D. GUADIANA","away":"U.P. PLASENCIA \"A\""},{"md":31,"date":"2027-04-18","home":"C.D. AZUAGA","away":"C.D. QUINTANA"},{"md":31,"date":"2027-04-18","home":"C.D. CABEZA DEL BUEY","away":"ATLETICO CLUB PUEBLONUEVO"},{"md":31,"date":"2027-04-18","home":"U.D. MONTIJO \"A\"","away":"MORALO C.P. \"A\""},{"md":31,"date":"2027-04-18","home":"S.P. VILLAFRANCA \"A\"","away":"A.D. LLERENENSE \"A\""},{"md":32,"date":"2027-04-25","home":"C.D. GEVORA \"A\"","away":"C.D. SANTA AMALIA \"A\""},{"md":32,"date":"2027-04-25","home":"ESC.FUT. PUEBLA DE LA CALZADA \"A\"","away":"C.D. ZAFRA \"A\""},{"md":32,"date":"2027-04-25","home":"C.D. CASTUERA SUBASTACAR","away":"C.F. JARAIZ \"A\""},{"md":32,"date":"2027-04-25","home":"U.P. PLASENCIA \"A\"","away":"C.F. VILLANOVENSE"},{"md":32,"date":"2027-04-25","home":"C.D. QUINTANA","away":"C.D. GUADIANA"},{"md":32,"date":"2027-04-25","home":"ATLETICO CLUB PUEBLONUEVO","away":"C.D. AZUAGA"},{"md":32,"date":"2027-04-25","home":"MORALO C.P. \"A\"","away":"C.D. CABEZA DEL BUEY"},{"md":32,"date":"2027-04-25","home":"A.D. LLERENENSE \"A\"","away":"U.D. MONTIJO \"A\""},{"md":32,"date":"2027-04-25","home":"S.P. VILLAFRANCA \"A\"","away":"JEREZ C.F. \"A\""},{"md":33,"date":"2027-05-02","home":"C.D. GEVORA \"A\"","away":"JEREZ C.F. \"A\""},{"md":33,"date":"2027-05-02","home":"C.D. SANTA AMALIA \"A\"","away":"ESC.FUT. PUEBLA DE LA CALZADA \"A\""},{"md":33,"date":"2027-05-02","home":"C.D. ZAFRA \"A\"","away":"C.D. CASTUERA SUBASTACAR"},{"md":33,"date":"2027-05-02","home":"C.F. JARAIZ \"A\"","away":"U.P. PLASENCIA \"A\""},{"md":33,"date":"2027-05-02","home":"C.F. VILLANOVENSE","away":"C.D. QUINTANA"},{"md":33,"date":"2027-05-02","home":"C.D. GUADIANA","away":"ATLETICO CLUB PUEBLONUEVO"},{"md":33,"date":"2027-05-02","home":"C.D. AZUAGA","away":"MORALO C.P. \"A\""},{"md":33,"date":"2027-05-02","home":"C.D. CABEZA DEL BUEY","away":"A.D. LLERENENSE \"A\""},{"md":33,"date":"2027-05-02","home":"U.D. MONTIJO \"A\"","away":"S.P. VILLAFRANCA \"A\""},{"md":34,"date":"2027-05-09","home":"ESC.FUT. PUEBLA DE LA CALZADA \"A\"","away":"C.D. GEVORA \"A\""},{"md":34,"date":"2027-05-09","home":"C.D. CASTUERA SUBASTACAR","away":"C.D. SANTA AMALIA \"A\""},{"md":34,"date":"2027-05-09","home":"U.P. PLASENCIA \"A\"","away":"C.D. ZAFRA \"A\""},{"md":34,"date":"2027-05-09","home":"C.D. QUINTANA","away":"C.F. JARAIZ \"A\""},{"md":34,"date":"2027-05-09","home":"ATLETICO CLUB PUEBLONUEVO","away":"C.F. VILLANOVENSE"},{"md":34,"date":"2027-05-09","home":"MORALO C.P. \"A\"","away":"C.D. GUADIANA"},{"md":34,"date":"2027-05-09","home":"A.D. LLERENENSE \"A\"","away":"C.D. AZUAGA"},{"md":34,"date":"2027-05-09","home":"S.P. VILLAFRANCA \"A\"","away":"C.D. CABEZA DEL BUEY"},{"md":34,"date":"2027-05-09","home":"JEREZ C.F. \"A\"","away":"U.D. MONTIJO \"A\""}];
