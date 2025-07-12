package com.example.android_app.ui;

import android.content.Intent;
import android.os.Bundle;
import android.util.Base64;
import android.view.View;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.example.android_app.R;
import com.example.android_app.core.AppDatabase;
import com.example.android_app.core.MyApplication;
import com.example.android_app.core.utils.FormValidator;
import com.example.android_app.viewmodel.MailViewModel;
import com.example.android_app.viewmodel.UserViewModel;
import com.google.android.material.button.MaterialButton;

import org.json.JSONObject;

public class LoginActivity extends AppCompatActivity {
    private boolean isEmailStage = true;
    private EditText emailInput, passwordInput;
    private LinearLayout emailStep, passwordStep;
    private MaterialButton nextButton, backButton;

    private UserViewModel userViewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        userViewModel = MyApplication.getInstance().getUserViewModel();

        initViews();
        setupListeners();
        checkSignedInUser();
        observeLoginResult();
    }

    private void initViews() {
        emailStep = findViewById(R.id.emailStep);
        emailInput = findViewById(R.id.emailInput);
        nextButton = findViewById(R.id.nextButton);
        backButton = findViewById(R.id.backButton);
        passwordStep = findViewById(R.id.passwordStep);
        passwordInput = findViewById(R.id.passwordInput);
    }

    private void setupListeners() {
        nextButton.setOnClickListener(v -> {
            if (isEmailStage) handleEmailStep();
            else handlePasswordStep();
        });

        backButton.setOnClickListener(v -> switchToEmailStep());

        findViewById(R.id.createAccountText).setOnClickListener(v -> {
            Intent intent = new Intent(this, RegisterActivity.class);
            startActivity(intent);
        });
    }

    private void handleEmailStep() {
        String email = emailInput.getText().toString().trim();

        if (!FormValidator.isEmailValid(email)) {
            showToast("Please enter a valid email address");
            return;
        }

        animateToPasswordStep();
    }

    private void handlePasswordStep() {
        String email = emailInput.getText().toString().trim();
        String password = passwordInput.getText().toString().trim();

        if (!FormValidator.isEmailValid(email)) {
            showToast("Invalid email address");
            return;
        }

        if (!FormValidator.isPasswordValid(password)) {
            showToast("Password must be at least 8 characters");
            return;
        }

        userViewModel.signIn(email, password);
    }

    private void animateToPasswordStep() {
        emailStep.animate()
                .translationX(-emailStep.getWidth())
                .alpha(0f)
                .setDuration(300)
                .withEndAction(() -> {
                    emailStep.setVisibility(View.GONE);
                    emailStep.setAlpha(1f);
                    emailStep.setTranslationX(0f);

                    passwordStep.setVisibility(View.VISIBLE);
                    passwordStep.setTranslationX(passwordStep.getWidth());
                    passwordStep.setAlpha(0f);
                    passwordStep.animate()
                            .translationX(0f)
                            .alpha(1f)
                            .setDuration(300)
                            .start();

                    nextButton.setText("Sign in");
                    isEmailStage = false;
                }).start();
    }

    private void switchToEmailStep() {
        passwordStep.animate()
                .translationX(passwordStep.getWidth())
                .alpha(0f)
                .setDuration(300)
                .withEndAction(() -> {
                    passwordStep.setVisibility(View.GONE);
                    passwordStep.setAlpha(1f);
                    passwordStep.setTranslationX(0f);

                    emailStep.setVisibility(View.VISIBLE);
                    emailStep.setTranslationX(-emailStep.getWidth());
                    emailStep.setAlpha(0f);
                    emailStep.animate()
                            .translationX(0f)
                            .alpha(1f)
                            .setDuration(300)
                            .start();

                    nextButton.setText("Next");
                    isEmailStage = true;
                }).start();
    }

    private void observeLoginResult() {
        userViewModel.getLoginSuccess().observe(this, success -> {
            if (Boolean.TRUE.equals(success)) {
                goToMails();
            }
        });

        userViewModel.getErrorMessage().observe(this, error -> {
            if (error != null) showToast(error);
        });
    }

    private void checkSignedInUser() {
        AppDatabase.getInstance(getApplicationContext())
                .userDao()
                .getUser()
                .observe(this, user -> {
                    if (user != null && user.getToken() != null && !user.getToken().isEmpty()) {
                        if (isTokenExpired(user.getToken())) {
                            showToast("Session expired, please log in again");
                        } else {
                            Toast.makeText(this, "Logged in as " + user.getEmail(), Toast.LENGTH_SHORT).show();
                            goToMails();
                        }
                    }
                });
    }

    private boolean isTokenExpired(String jwt) {
        try {
            String[] parts = jwt.split("\\.");
            if (parts.length != 3) return true;

            String payloadJson = new String(Base64.decode(parts[1], Base64.URL_SAFE));
            JSONObject payload = new JSONObject(payloadJson);

            long exp = payload.getLong("exp");
            long currentTime = System.currentTimeMillis() / 1000;

            return currentTime > exp;
        } catch (Exception e) {
            e.printStackTrace();
            return true;
        }
    }

    private void goToMails() {
        Intent intent = new Intent(this, MailsActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
    }

    private void showToast(String msg) {
        Toast.makeText(this, msg, Toast.LENGTH_SHORT).show();
    }
}
