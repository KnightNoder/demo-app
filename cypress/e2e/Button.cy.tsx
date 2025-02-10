import React from "react";
import { mount } from "cypress/react";
import Button from "../../src/components/atoms/Button/Button"; // Adjust the import path accordingly

describe('My First Test', () => {
  it('Visit the Dr cloud EHR', () => {
    cy.visit('http://localhost:5173')
  })
})
