import { renderHook, act } from '@testing-library/react';
import { useSpeechSynthesis } from './useSpeechSynthesis';

describe('useSpeechSynthesis', () => {
  const mockSpeak = jest.fn();
  const mockCancel = jest.fn();
  const mockUtterance = jest.fn();

  interface UtteranceCallbacks {
    start: () => void;
    end: () => void;
    error: () => void;
  }

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the Web Speech API
    Object.defineProperty(window, 'speechSynthesis', {
      value: {
        speak: mockSpeak,
        cancel: mockCancel,
      },
      writable: true,
    });
    (global as any).SpeechSynthesisUtterance = mockUtterance;
  });

  it('initializes with correct default values', () => {
    const { result } = renderHook(() => useSpeechSynthesis());
    
    expect(result.current.speaking).toBe(false);
    expect(result.current.supported).toBe(true);
  });

  it('sets supported to false when Speech API is not available', () => {
    delete (window as any).speechSynthesis;
    
    const { result } = renderHook(() => useSpeechSynthesis());
    expect(result.current.supported).toBe(false);
  });

  it('speaks text and updates speaking state', () => {
    const { result } = renderHook(() => useSpeechSynthesis());
    
    let utteranceCallbacks: UtteranceCallbacks = {
      start: () => {},
      end: () => {},
      error: () => {},
    };

    mockUtterance.mockImplementation(function(text: string) {
      return {
        text,
        onstart: null,
        onend: null,
        onerror: null,
      };
    });

    mockSpeak.mockImplementation((utterance) => {
      utteranceCallbacks = {
        start: utterance.onstart,
        end: utterance.onend,
        error: utterance.onerror,
      };
    });

    act(() => {
      result.current.speak('Hello World');
    });

    expect(mockCancel).toHaveBeenCalled();
    expect(mockUtterance).toHaveBeenCalledWith('Hello World');
    expect(mockSpeak).toHaveBeenCalled();

    // Simulate speech start
    act(() => {
      utteranceCallbacks.start();
    });
    expect(result.current.speaking).toBe(true);

    // Simulate speech end
    act(() => {
      utteranceCallbacks.end();
    });
    expect(result.current.speaking).toBe(false);
  });

  it('handles speech errors', () => {
    const { result } = renderHook(() => useSpeechSynthesis());
    
    let utteranceCallbacks: UtteranceCallbacks = {
      start: () => {},
      end: () => {},
      error: () => {},
    };

    mockUtterance.mockImplementation(function(text: string) {
      return {
        text,
        onstart: null,
        onend: null,
        onerror: null,
      };
    });

    mockSpeak.mockImplementation((utterance) => {
      utteranceCallbacks = {
        start: utterance.onstart,
        end: utterance.onend,
        error: utterance.onerror,
      };
    });

    act(() => {
      result.current.speak('Hello World');
    });

    // Simulate speech error
    act(() => {
      utteranceCallbacks.error();
    });
    expect(result.current.speaking).toBe(false);
  });

  it('stops speech when stop is called', () => {
    const { result } = renderHook(() => useSpeechSynthesis());
    
    act(() => {
      result.current.stop();
    });

    expect(mockCancel).toHaveBeenCalled();
    expect(result.current.speaking).toBe(false);
  });

  it('does not attempt to speak when not supported', () => {
    delete (window as any).speechSynthesis;
    
    const { result } = renderHook(() => useSpeechSynthesis());
    
    act(() => {
      result.current.speak('Hello World');
    });

    expect(mockSpeak).not.toHaveBeenCalled();
  });
}); 