package com.tts.employeemange.exception;

public class UserNotFoundException extends RuntimeException{

  public UserNotFoundException(String message) {
      super(message);
  }
}
