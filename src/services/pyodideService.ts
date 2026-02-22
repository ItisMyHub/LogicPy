import type { ExecutionResult } from '@/types';

// Pyodide service for in-browser Python execution
// Uses CDN to load the Python interpreter

let pyodideInstance: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;
let loadError: Error | null = null;

// CDN URL for Pyodide
const PYODIDE_VERSION = '0.25.0';
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/pyodide.mjs`;

// Initialize Pyodide (loads Python interpreter in browser)
export async function initPyodide(): Promise<any> {
  // Return existing instance
  if (pyodideInstance) {
    return pyodideInstance;
  }
  
  // Return existing promise if loading
  if (loadPromise) {
    return loadPromise;
  }
  
  // Return error if previous load failed
  if (loadError) {
    throw loadError;
  }
  
  isLoading = true;
  
  loadPromise = new Promise(async (resolve, reject) => {
    try {
      // Dynamic import of Pyodide from CDN
      const { loadPyodide } = await import(/* @vite-ignore */ PYODIDE_CDN);
      
      const instance = await loadPyodide({
        indexURL: `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`,
        stdout: () => {},
        stderr: () => {}
      });
      
      pyodideInstance = instance;
      isLoading = false;
      resolve(instance);
    } catch (error) {
      loadError = error instanceof Error ? error : new Error(String(error));
      isLoading = false;
      reject(loadError);
    }
  });
  
  return loadPromise;
}

// Check if Pyodide is ready
export function isPyodideReady(): boolean {
  return pyodideInstance !== null;
}

// Check if Pyodide is loading
export function isPyodideLoading(): boolean {
  return isLoading;
}

// Check if there was a load error
export function getLoadError(): Error | null {
  return loadError;
}

// Execute Python code
export async function executePython(code: string): Promise<ExecutionResult> {
  const startTime = performance.now();
  let output = '';
  
  try {
    // Ensure Pyodide is loaded
    if (!pyodideInstance) {
      await initPyodide();
    }
    
    if (!pyodideInstance) {
      throw new Error('Python interpreter failed to load');
    }
    
    // Set up output capture
    pyodideInstance.setStdout({ 
      batched: (text: string) => {
        output += text;
        if (!text.endsWith('\n')) {
          output += '\n';
        }
      }
    });
    
    pyodideInstance.setStderr({ 
      batched: (text: string) => {
        output += text;
        if (!text.endsWith('\n')) {
          output += '\n';
        }
      }
    });
    
    // Run the code
    await pyodideInstance.runPythonAsync(code);
    
    const executionTime = performance.now() - startTime;
    
    return {
      output: output.trim() || '(No output)',
      error: null,
      executionTime: Math.round(executionTime * 100) / 100
    };
    
  } catch (error) {
    const executionTime = performance.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      output: output.trim() || '',
      error: errorMessage,
      executionTime: Math.round(executionTime * 100) / 100
    };
  }
}

// Get loading status message
export function getLoadingStatus(): string {
  if (pyodideInstance) return 'Ready';
  if (isLoading) return 'Loading...';
  if (loadError) return 'Error';
  return 'Not started';
}

// Retry loading after error
export async function retryLoadPyodide(): Promise<void> {
  loadError = null;
  loadPromise = null;
  pyodideInstance = null;
  await initPyodide();
}
