import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ReviewForm from './index';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../lib/i18n';


const renderWithI18n = (component: React.ReactElement) => {
  return render(<I18nextProvider i18n={i18n}>{component}</I18nextProvider>);
};

describe('ReviewForm', () => {
  
  it('should render the form correctly', () => {
    renderWithI18n(<ReviewForm onSubmit={() => {}} isLoading={false} />);
    
    expect(screen.getByText(i18n.t('review_form_title'))).toBeInTheDocument();
    expect(screen.getByPlaceholderText(i18n.t('review_form_comment_placeholder'))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('review_form_submit_button') })).toBeInTheDocument();
  });

  
  it('should have a disabled submit button until a rating is given', () => {
    renderWithI18n(<ReviewForm onSubmit={() => {}} isLoading={false} />);

    const submitButton = screen.getByRole('button', { name: i18n.t('review_form_submit_button') });

    
    expect(submitButton).toBeDisabled();

    
    const stars = document.querySelectorAll('svg');
    fireEvent.click(stars[3]); 

    
    expect(submitButton).not.toBeDisabled();
  });

  it('should call onSubmit with correct data when submitted', () => {
    const handleSubmit = vi.fn();
    
    renderWithI18n(<ReviewForm onSubmit={handleSubmit} isLoading={false} />);
    
    
    const stars = document.querySelectorAll('svg');
    fireEvent.click(stars[3]);

    const textarea = screen.getByPlaceholderText(i18n.t('review_form_comment_placeholder'));
    fireEvent.change(textarea, { target: { value: 'Es hat mir sehr gut gefallen!' } });
    
    const submitButton = screen.getByRole('button', { name: i18n.t('review_form_submit_button') });
    fireEvent.click(submitButton);
    
    expect(handleSubmit).toHaveBeenCalledWith(4, 'Es hat mir sehr gut gefallen!');
  });

});