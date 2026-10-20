package com.reownix.auth.exception;


import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

import com.reownix.product.exception.UnauthorizedException;
import com.reownix.product.exception.ProductNotFoundException;
import org.springframework.security.access.AccessDeniedException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(

            UserNotFoundException ex,

            HttpServletRequest request) {

        ErrorResponse error = ErrorResponse.builder()

                .timestamp(LocalDateTime.now())

                .status(HttpStatus.NOT_FOUND.value())

                .error("User Not Found")

                .message(ex.getMessage())

                .path(request.getRequestURI())

                .build();

        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);

    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleEmailExists(

            EmailAlreadyExistsException ex,

            HttpServletRequest request) {

        ErrorResponse error = ErrorResponse.builder()

                .timestamp(LocalDateTime.now())

                .status(HttpStatus.CONFLICT.value())

                .error("Email Already Exists")

                .message(ex.getMessage())

                .path(request.getRequestURI())

                .build();

        return new ResponseEntity<>(error, HttpStatus.CONFLICT);

    }

    @ExceptionHandler(InvalidPasswordException.class)
    public ResponseEntity<ErrorResponse> handlePassword(

            InvalidPasswordException ex,

            HttpServletRequest request) {

        ErrorResponse error = ErrorResponse.builder()

                .timestamp(LocalDateTime.now())

                .status(HttpStatus.BAD_REQUEST.value())

                .error("Invalid Password")

                .message(ex.getMessage())

                .path(request.getRequestURI())

                .build();

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);

    }

    @ExceptionHandler(RoleNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleRole(

            RoleNotFoundException ex,

            HttpServletRequest request) {

        ErrorResponse error = ErrorResponse.builder()

                .timestamp(LocalDateTime.now())

                .status(HttpStatus.NOT_FOUND.value())

                .error("Role Not Found")

                .message(ex.getMessage())

                .path(request.getRequestURI())

                .build();

        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);

    }

    @ExceptionHandler({UnauthorizedException.class, AccessDeniedException.class})
    public ResponseEntity<ErrorResponse> handleUnauthorized(
            RuntimeException ex,
            HttpServletRequest request) {

        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.FORBIDDEN.value())
                .error("Forbidden")
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .build();

        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleProductNotFound(
            ProductNotFoundException ex,
            HttpServletRequest request) {

        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.NOT_FOUND.value())
                .error("Not Found")
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .build();

        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAll(

            Exception ex,

            HttpServletRequest request) {

        ErrorResponse error = ErrorResponse.builder()

                .timestamp(LocalDateTime.now())

                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())

                .error("Internal Server Error")

                .message(ex.getMessage())

                .path(request.getRequestURI())

                .build();

        return new ResponseEntity<>(error,
                HttpStatus.INTERNAL_SERVER_ERROR);

    }

}
