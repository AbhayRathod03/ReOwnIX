package com.reownix.product.exception;

public class CategoryNotFoundException extends RuntimeException{
	public CategoryNotFoundException(String message) {
		super(message);
	}
}
