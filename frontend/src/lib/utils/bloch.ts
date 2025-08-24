/**
 * Utility functions for Bloch sphere calculations
 */

export interface BlochVector {
  x: number;
  y: number;
  z: number;
}

/**
 * Convert a statevector to Bloch sphere coordinates
 * For a single qubit: |ψ⟩ = α|0⟩ + β|1⟩
 * Bloch vector components: x = 2Re(α*β), y = 2Im(α*β), z = |α|² - |β|²
 */
export function statevectorToBloch(statevector: number[]): BlochVector {
  if (statevector.length < 2) {
    throw new Error('Statevector must have at least 2 components for single qubit');
  }

  // For complex numbers represented as [real, imag, real, imag, ...]
  let alpha_real: number, alpha_imag: number, beta_real: number, beta_imag: number;

  if (statevector.length === 4) {
    // Complex representation: [α_real, α_imag, β_real, β_imag]
    [alpha_real, alpha_imag, beta_real, beta_imag] = statevector;
  } else if (statevector.length === 2) {
    // Real representation: [α, β] (assuming imaginary parts are 0)
    [alpha_real, beta_real] = statevector;
    alpha_imag = 0;
    beta_imag = 0;
  } else {
    // Take first two complex amplitudes
    alpha_real = statevector[0];
    alpha_imag = statevector[1] || 0;
    beta_real = statevector[2] || 0;
    beta_imag = statevector[3] || 0;
  }

  // Calculate Bloch vector components
  // x = 2 * Re(α* β) = 2 * (α_real * β_real + α_imag * β_imag)
  const x = 2 * (alpha_real * beta_real + alpha_imag * beta_imag);
  
  // y = 2 * Im(α* β) = 2 * (α_real * β_imag - α_imag * β_real)
  const y = 2 * (alpha_real * beta_imag - alpha_imag * beta_real);
  
  // z = |α|² - |β|²
  const alpha_magnitude_sq = alpha_real * alpha_real + alpha_imag * alpha_imag;
  const beta_magnitude_sq = beta_real * beta_real + beta_imag * beta_imag;
  const z = alpha_magnitude_sq - beta_magnitude_sq;

  return { x, y, z };
}

/**
 * Normalize a Bloch vector to ensure it's within the unit sphere
 */
export function normalizeBlochVector(vector: BlochVector): BlochVector {
  const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
  
  if (magnitude === 0) {
    return { x: 0, y: 0, z: 1 }; // Default to |0⟩ state
  }

  if (magnitude <= 1) {
    return vector; // Already normalized
  }

  return {
    x: vector.x / magnitude,
    y: vector.y / magnitude,
    z: vector.z / magnitude,
  };
}

/**
 * Convert Bloch data from API to normalized Bloch vector
 */
export function processBlochData(blochData: { type: string; data: number[] }): BlochVector {
  switch (blochData.type) {
    case 'vector':
      if (blochData.data.length < 3) {
        throw new Error('Bloch vector must have 3 components [x, y, z]');
      }
      return normalizeBlochVector({
        x: blochData.data[0],
        y: blochData.data[1],
        z: blochData.data[2],
      });
    
    case 'statevector':
      return normalizeBlochVector(statevectorToBloch(blochData.data));
    
    default:
      throw new Error(`Unsupported Bloch data type: ${blochData.type}`);
  }
}