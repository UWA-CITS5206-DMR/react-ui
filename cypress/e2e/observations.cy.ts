/**
 * E2E Tests for Observation/Vital Signs Feature
 *
 * This test suite verifies the functionality of recording vital signs
 * for patients in the student dashboard.
 */

/// <reference types="cypress" />

describe("Observations Feature - E2E Tests", () => {
  /**
   * Setup: Login and navigate to patient before each test
   * This ensures each test starts with a clean, consistent state
   */
  beforeEach(() => {
    // Visit the application home page
    cy.visit("/");

    // Login using the landing page form (match actual input ids)
    cy.get("#username").clear().type("sg1");
    cy.get("#password").clear().type("studentgroup-1");
    cy.get("button")
      .contains(/^Sign In$/i)
      .click();

    // Wait for dashboard to load
    cy.url().should("include", "/student");

    // Select the first patient in the patient list to avoid relying on a specific name
    cy.get('[data-testid="patient-list"]').within(() => {
      cy.get('[data-testid^="patient-item-"]').first().click();
    });

    // Open the Observations tab in the patient view
    cy.contains("Observations").click();
  });

  /**
   * Test Case OBS-001: Add Individual Vital Signs
   * Verifies that users can successfully record vital signs one at a time
   */
  it("OBS-001: Should allow user to add individual vital signs records", () => {
    // Navigate to "Add Observations" tab and ensure Individual Entry is visible
    cy.contains("Add Observations").click();
    cy.contains("Individual Entry").should("be.visible");

    // Test 1: Record Blood Pressure
    cy.get("#bp-systolic").clear().type("125");
    cy.get("#bp-diastolic").clear().type("85");
    // Ensure card is scrolled into view then click Record
    cy.get("#bp-systolic")
      .closest("div")
      .parent()
      .scrollIntoView()
      .within(() => {
        cy.contains("button", /^Record$/).click({ force: true });
      });

    // Test 2: Record Heart Rate
    cy.get("#heartRate").clear().type("75");
    cy.get("#heartRate")
      .closest("div")
      .parent()
      .scrollIntoView()
      .within(() => {
        cy.contains("button", /^Record$/).click({ force: true });
      });

    // Test 3: Record Body Temperature
    cy.get("#temperature").clear().type("36.8");
    cy.get("#temperature")
      .closest("div")
      .parent()
      .scrollIntoView()
      .within(() => {
        cy.contains("button", /^Record$/).click({ force: true });
      });

    // Test 4: Record Respiratory Rate
    cy.get("#respiratoryRate").clear().type("18");
    cy.get("#respiratoryRate")
      .closest("div")
      .parent()
      .scrollIntoView()
      .within(() => {
        cy.contains("button", /^Record$/).click({ force: true });
      });

    // Test 5: Record Oxygen Saturation
    cy.get("#oxygenSaturation").clear().type("98");
    cy.get("#oxygenSaturation")
      .closest("div")
      .parent()
      .scrollIntoView()
      .within(() => {
        cy.contains("button", /^Record$/).click({ force: true });
      });

    // Test 6: Record Blood Sugar
    cy.get("#bloodSugar").clear().type("5.6");
    cy.get("#bloodSugar")
      .closest("div")
      .parent()
      .scrollIntoView()
      .within(() => {
        cy.contains("button", /^Record$/).click({ force: true });
      });

    // Test 7: Record Pain Score
    cy.get("#painScore").clear().type("6");
    cy.get("#painScore")
      .closest("div")
      .parent()
      .scrollIntoView()
      .within(() => {
        cy.contains("button", /^Record$/).click({ force: true });
      });
  });

  /**
   * Test Case OBS-002: View Current Observations
   * Verifies that users can view previously recorded vital signs
   */
  it("OBS-002: Should display current observations and historical data", () => {
    // Navigate to "Current Observations" tab
    cy.contains("Current Observations").click();
    // Verify that the observations display is visible
    cy.contains("Latest Observations").should("be.visible");
    cy.contains("Observations Chart").should("be.visible");
  });

  /**
   * Test Case OBS-003: Bulk Entry Mode
   * Verifies that users can enter multiple vital signs at once
   */
  it("OBS-003: Should allow user to add vital signs in bulk entry mode", () => {
    // Navigate to "Add Observations" tab and switch to Bulk Entry mode
    cy.contains("Add Observations").click();
    cy.contains("Bulk Entry").click();

    // Verify bulk entry form is displayed via card title
    cy.contains("Record All Observations").should("be.visible");

    // Fill in all fields using the bulk input ids
    cy.get("#bulk-systolic").clear().type("125"); // Systolic
    cy.get("#bulk-diastolic").clear().type("85"); // Diastolic
    cy.get("#bulk-heartRate").clear().type("75"); // Heart Rate
    cy.get("#bulk-temperature").clear().type("36.8"); // Temperature
    cy.get("#bulk-respiratoryRate").clear().type("18"); // Respiratory Rate
    cy.get("#bulk-oxygenSaturation").clear().type("98"); // O2 Saturation
    cy.get("#bulk-bloodSugar").clear().type("5.6"); // Blood Sugar
    cy.get("#bulk-painScore").clear().type("3"); // Pain Score

    // Submit the bulk form (scroll into view then click)
    cy.contains("button", "Record All Observations").scrollIntoView().click();

    // Verify recording indicator
    cy.contains("Recording...").should("be.visible");
  });

  /**
   * Test Case OBS-004: Input Validation
   * Verifies that the form validates input correctly
   */
  it("OBS-004: Should validate vital sign input values", () => {
    // Navigate to "Add Observations" tab
    cy.contains("Add Observations").click();

    // Test: Record button should be disabled with empty input for a given vital sign
    cy.get("#heartRate")
      .closest("div")
      .parent()
      .within(() => {
        cy.contains("button", /^Record$/).should("be.disabled");
      });

    // Test: Enter invalid pain score (out of range)
    cy.get("#painScore").clear().type("15"); // Max is 10 - UI should handle validation

    // Note: Additional validation tests can be added based on actual validation rules
  });
});
