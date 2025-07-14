package com.example.android_app.ui;

import android.app.DatePickerDialog;
import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.example.android_app.R;
import com.example.android_app.core.MyApplication;
import com.example.android_app.core.utils.FormValidator;
import com.example.android_app.viewmodel.UserViewModel;
import com.google.android.material.button.MaterialButton;

import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

public class RegisterActivity extends AppCompatActivity {
    private MaterialButton registerButton;
    private AutoCompleteTextView genderInput;
    private EditText firstNameInput, lastNameInput, birthDateInput;
    private EditText emailInput, passwordInput, confirmPasswordInput;

    private UserViewModel userViewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        userViewModel = MyApplication.getInstance().getUserViewModel();

        initViews();
        observeViewModel();

        birthDateInput.setOnClickListener(v -> {
            Calendar calendar = Calendar.getInstance();
            int year = calendar.get(Calendar.YEAR);
            int month = calendar.get(Calendar.MONTH);
            int day = calendar.get(Calendar.DAY_OF_MONTH);

            new DatePickerDialog(this, (view, selectedYear, selectedMonth, selectedDay) -> {
                String selectedDate = selectedYear + "-" + String.format("%02d", selectedMonth + 1) + "-" + String.format("%02d", selectedDay);
                birthDateInput.setText(selectedDate);
                birthDateInput.clearFocus();
            }, year, month, day).show();
        });

        ArrayAdapter<String> genderAdapter = new ArrayAdapter<>(this,
                android.R.layout.simple_dropdown_item_1line, new String[]{"Male", "Female"});
        ((AutoCompleteTextView) genderInput).setAdapter(genderAdapter);

        genderInput.setOnClickListener(v -> genderInput.showDropDown());

        registerButton.setOnClickListener(v -> {
            if (validateForm()) {
                Map<String, Object> payload = new HashMap<>();
                payload.put("firstName", firstNameInput.getText().toString().trim());
                payload.put("lastName", lastNameInput.getText().toString().trim());
                payload.put("birthDate", birthDateInput.getText().toString().trim());
                payload.put("gender", genderInput.getText().toString().trim());
                payload.put("email", emailInput.getText().toString().trim());
                payload.put("password", passwordInput.getText().toString().trim());
                payload.put("confirmPassword", confirmPasswordInput.getText().toString().trim());
                payload.put("image", null);

                userViewModel.register(payload);
            }
        });

        findViewById(R.id.backToLogin).setOnClickListener(v -> {
            finish();
        });
    }

    private void initViews() {
        firstNameInput = findViewById(R.id.firstNameInput);
        lastNameInput = findViewById(R.id.lastNameInput);
        birthDateInput = findViewById(R.id.birthDateInput);
        genderInput = findViewById(R.id.genderInput);
        emailInput = findViewById(R.id.emailInput);
        passwordInput = findViewById(R.id.passwordInput);
        confirmPasswordInput = findViewById(R.id.confirmPasswordInput);
        registerButton = findViewById(R.id.registerButton);
    }

    private boolean validateForm() {
        String firstName = firstNameInput.getText().toString().trim();
        String lastName = lastNameInput.getText().toString().trim();
        String birthDate = birthDateInput.getText().toString().trim();
        String gender = genderInput.getText().toString().trim();
        String email = emailInput.getText().toString().trim();
        String password = passwordInput.getText().toString().trim();
        String confirmPassword = confirmPasswordInput.getText().toString().trim();

        if (!FormValidator.isNameValid(firstName)) {
            showToast("Enter a valid first name");
            return false;
        }

        if (!FormValidator.isNameValid(lastName)) {
            showToast("Enter a valid last name");
            return false;
        }

        if (!FormValidator.isDateValid(birthDate)) {
            showToast("Invalid birthdate");
            return false;
        }

        if (!FormValidator.isGenderValid(gender)) {
            showToast("Select gender: Male or Female");
            return false;
        }

        if (!FormValidator.isEmailValid(email)) {
            showToast("Email must end with @mailsnap.com and contain only one '@'");
            return false;
        }

        if (!FormValidator.isPasswordValid(password)) {
            showToast("Password must be at least 8 characters");
            return false;
        }

        if (!FormValidator.doPasswordsMatch(password, confirmPassword)) {
            showToast("Passwords do not match");
            return false;
        }

        return true;
    }

    private void observeViewModel() {
        userViewModel.getRegisterSuccess().observe(this, success -> {
            if (Boolean.TRUE.equals(success)) {
                showToast("Registration successful!");
                finish();
            }
        });

        userViewModel.getErrorMessage().observe(this, error -> {
            if (error != null) {
                showToast(error);
            }
        });
    }

    private void showToast(String message) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
    }
}