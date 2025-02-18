import React from "react";
import { mount } from "cypress/react";
// import Button from "../../src/components/atoms/Button/Button"; // Adjust the import path accordingly

describe('My First Test', () => {
  it('Check all cards rendered', {
    viewportHeight: 1000,
    viewportWidth: 2000,
  }, () => {
    cy.visit('http://localhost:5173')
    cy.contains('Allergies')
    cy.contains('Diagnosis')
    cy.contains('Clinical Notes')
    cy.contains('Insurance')
    cy.contains('Medications')
  })

  it('Check Allergies Card rendered', () => {
    cy.visit('http://localhost:5173')
    cy.contains('Allergies')
    cy.contains('Diagnosis')
    cy.contains('Clinical Notes')
    cy.contains('Insurance')
    cy.contains('Medications')
  })

  it('Check Diagnosis Card rendered', () => {
    cy.visit('http://localhost:5173')
    cy.contains('Diagnosis')

  })
  it('Check Clinical Notes rendered', () => {
    cy.visit('http://localhost:5173')
    cy.contains('Clinical Notes')

  })
  it('Check Insurance Card rendered', () => {
    cy.visit('http://localhost:5173')
    cy.contains('Insurance')
  })
  it('Check Medications Card rendered', () => {
    cy.visit('http://localhost:5173')
    cy.contains('Medications')
  })

})
