import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SpeechBar } from './SpeechBar';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';

jest.mock('../../hooks/useSpeechSynthesis', () => ({
  useSpeechSynthesis: jest.fn(),
}));

describe('SpeechBar', () => {
  const mockSpeak = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useSpeechSynthesis as jest.Mock).mockReturnValue({
      speak: mockSpeak,
      speaking: false,
    });
  });

  it('renders input field and buttons', () => {
    render(<SpeechBar />);
    
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /speak/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('updates text input value', () => {
    render(<SpeechBar />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'Hello World' } });
    expect(input).toHaveValue('Hello World');
  });

  it('speaks text when speak button is clicked', () => {
    render(<SpeechBar />);
    const input = screen.getByRole('textbox');
    const speakButton = screen.getByRole('button', { name: /speak/i });
    
    fireEvent.change(input, { target: { value: 'Hello World' } });
    fireEvent.click(speakButton);
    
    expect(mockSpeak).toHaveBeenCalledWith('Hello World');
  });

  it('clears text when clear button is clicked', () => {
    render(<SpeechBar />);
    const input = screen.getByRole('textbox');
    const clearButton = screen.getByRole('button', { name: /clear/i });
    
    fireEvent.change(input, { target: { value: 'Hello World' } });
    fireEvent.click(clearButton);
    
    expect(input).toHaveValue('');
  });

  it('speaks text when Enter is pressed', () => {
    render(<SpeechBar />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'Hello World' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(mockSpeak).toHaveBeenCalledWith('Hello World');
  });

  it('does not speak when text is empty', () => {
    render(<SpeechBar />);
    const speakButton = screen.getByRole('button', { name: /speak/i });
    
    fireEvent.click(speakButton);
    expect(mockSpeak).not.toHaveBeenCalled();
  });

  it('disables speak button when speaking', () => {
    (useSpeechSynthesis as jest.Mock).mockReturnValue({
      speak: mockSpeak,
      speaking: true,
    });

    render(<SpeechBar />);
    const input = screen.getByRole('textbox');
    const speakButton = screen.getByRole('button', { name: /speak/i });
    
    fireEvent.change(input, { target: { value: 'Hello World' } });
    expect(speakButton).toBeDisabled();
  });

  it('disables clear button when text is empty', () => {
    render(<SpeechBar />);
    const clearButton = screen.getByRole('button', { name: /clear/i });
    
    expect(clearButton).toBeDisabled();
  });

  it('does not speak when shift+enter is pressed', () => {
    render(<SpeechBar />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'Hello World' } });
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });
    
    expect(mockSpeak).not.toHaveBeenCalled();
  });
}); 