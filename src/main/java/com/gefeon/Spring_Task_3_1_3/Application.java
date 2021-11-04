package com.gefeon.Spring_Task_3_1_3;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;

@SpringBootApplication
public class Application {
	public static void main(String[] args) throws IOException {
		SpringApplication.run(Application.class, args);
		openLoginPage();
	}

	private static void openLoginPage() throws IOException {
		Runtime rt = Runtime.getRuntime();
		rt.exec("rundll32 url.dll,FileProtocolHandler " + "http://localhost:8080/login");
	}
}
