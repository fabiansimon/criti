export class REGEX {
  static email = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  static timestamp = /^([0-5][0-9]):([0-5][0-9])$/;
  static roomPassword = /^.{8,}$/;
  static userPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  static username = /^[A-Z][a-zA-Z'-]+ [A-Z][a-zA-Z'-]+$/;
}
