import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  test('renders the upload form', () => {
    render(<App />);
    const uploadFormElement = screen.getByText(/upload your resume/i);
    expect(uploadFormElement).toBeInTheDocument();
  });

  test('renders the analysis summary section', () => {
    render(<App />);
    const analysisSummaryElement = screen.getByText(/analysis summary/i);
    expect(analysisSummaryElement).toBeInTheDocument();
  });

  test('renders the suggestions list section', () => {
    render(<App />);
    const suggestionsListElement = screen.getByText(/suggestions for improvement/i);
    expect(suggestionsListElement).toBeInTheDocument();
  });

  test('renders the rating badge section', () => {
    render(<App />);
    const ratingBadgeElement = screen.getByText(/resume rating/i);
    expect(ratingBadgeElement).toBeInTheDocument();
  });

  test('renders the skills gap section', () => {
    render(<App />);
    const skillsGapElement = screen.getByText(/skills gap/i);
    expect(skillsGapElement).toBeInTheDocument();
  });
});