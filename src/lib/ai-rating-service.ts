/**
 * AI Rating Service
 *
 * Helper functions for integrating with the backend AI rating system.
 * Handles communication with the Flask backend for role evaluation and scoring.
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:6502';

export interface ChatLog {
  speaker: string;
  text: string;
}

export interface RoleData {
  player_name: string;
  role_name: string;
  personality: string;
  role_description: string;
  guidelines: string[];
  scenario_name: string;
  scenario_description: string;
  scenario_seed: string;
}

export interface AIEvaluation {
  performance_score: number;
  bonus_points: number;
  feedback: string;
  strengths: string[];
  areas_for_improvement: string[];
}

export interface ScoreBreakdown {
  guessing_points: number;
  bonus_points: number;
  total_score: number;
}

export interface PerformanceRatingResult {
  status: 'success' | 'error';
  player: string;
  ai_evaluation?: AIEvaluation;
  score_breakdown?: ScoreBreakdown;
  total_score?: number;
  message?: string;
}

/**
 * Save player's role information for AI evaluation.
 * Call this when the roleplay phase starts.
 *
 * @param playerId - The player's ID
 * @param roleData - Player's role information
 * @returns Promise resolving to success status
 */
export async function savePlayerRole(
  playerId: string,
  roleData: RoleData
): Promise<{ status: 'success' | 'error'; message?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/player/${playerId}/role`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roleData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving player role:', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to save player role',
    };
  }
}

/**
 * Save chat transcription/logs from roleplay phase.
 * Call this after the roleplay phase ends.
 *
 * @param playerId - The player's ID
 * @param chatLogs - Array of chat messages during roleplay
 * @returns Promise resolving to success status and message count
 */
export async function saveTranscription(
  playerId: string,
  chatLogs: ChatLog[]
): Promise<{
  status: 'success' | 'error';
  messages_saved?: number;
  message?: string;
}> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/player/${playerId}/transcription`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chat_logs: chatLogs }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving transcription:', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to save transcription',
    };
  }
}

/**
 * Get AI performance rating and calculate total score.
 * Call this during the results phase after collecting guesses.
 *
 * @param playerId - The player's ID
 * @param correctGuesses - Number of correct role guesses by this player
 * @param pointsPerCorrectGuess - Points awarded per correct guess (default 10)
 * @returns Promise resolving to performance rating and score breakdown
 */
export async function ratePerformance(
  playerId: string,
  correctGuesses: number,
  pointsPerCorrectGuess: number = 10
): Promise<PerformanceRatingResult> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/player/${playerId}/rate-performance`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correct_guesses: correctGuesses,
          points_per_correct_guess: pointsPerCorrectGuess,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error rating performance:', error);
    return {
      status: 'error',
      player: playerId,
      message: error instanceof Error ? error.message : 'Failed to rate performance',
    };
  }
}

/**
 * Clear all stored data for a new game session.
 * Call this when starting a new game.
 *
 * @returns Promise resolving to cleanup status
 */
export async function cleanup(): Promise<{
  status: 'success' | 'error';
  message?: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cleanup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error cleaning up:', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to cleanup',
    };
  }
}

/**
 * Complete workflow: Save role, save transcription, and get rating.
 * Convenience function that handles the full AI rating workflow.
 *
 * @param playerId - The player's ID
 * @param roleData - Player's role information
 * @param chatLogs - Array of chat messages from roleplay
 * @param correctGuesses - Number of correct guesses
 * @returns Promise resolving to complete performance result
 */
export async function completeRatingWorkflow(
  playerId: string,
  roleData: RoleData,
  chatLogs: ChatLog[],
  correctGuesses: number
): Promise<PerformanceRatingResult> {
  try {
    // Step 1: Save role data (if not already saved)
    await savePlayerRole(playerId, roleData);

    // Step 2: Save transcription
    await saveTranscription(playerId, chatLogs);

    // Step 3: Get performance rating
    const result = await ratePerformance(playerId, correctGuesses, 10);

    return result;
  } catch (error) {
    console.error('Error in rating workflow:', error);
    return {
      status: 'error',
      player: playerId,
      message: error instanceof Error ? error.message : 'Workflow failed',
    };
  }
}

/**
 * Calculate total points breakdown (useful for display).
 *
 * @param guessCount - Number of correct guesses
 * @param bonusPoints - Bonus points from AI evaluation
 * @param pointsPerGuess - Points per correct guess (default 10)
 * @returns Score breakdown object
 */
export function calculateScoreBreakdown(
  guessCount: number,
  bonusPoints: number,
  pointsPerGuess: number = 10
): ScoreBreakdown {
  const guessing_points = guessCount * pointsPerGuess;
  const total_score = guessing_points + bonusPoints;

  return {
    guessing_points,
    bonus_points: bonusPoints,
    total_score,
  };
}

/**
 * Format AI evaluation for display (e.g., in results screen).
 *
 * @param evaluation - AI evaluation object
 * @returns Formatted string with feedback and stats
 */
export function formatEvaluation(evaluation: AIEvaluation): string {
  const lines = [
    `Performance Score: ${evaluation.performance_score}/100`,
    `Bonus Points: ${evaluation.bonus_points}/50`,
    ``,
    `Feedback: ${evaluation.feedback}`,
    ``,
    `Strengths:`,
    ...evaluation.strengths.map((s) => `  • ${s}`),
    ``,
    `Areas for Improvement:`,
    ...evaluation.areas_for_improvement.map((a) => `  • ${a}`),
  ];

  return lines.join('\n');
}

/**
 * Get score tier based on total points.
 * Useful for displaying rank or achievement level.
 *
 * @param score - Total score
 * @returns Tier name
 */
export function getScoreTier(score: number): string {
  if (score >= 90) return '🏆 Legendary';
  if (score >= 70) return '⭐ Outstanding';
  if (score >= 50) return '✓ Good';
  if (score >= 30) return '○ Fair';
  return '✗ Needs Improvement';
}

/**
 * Validate role data before sending to backend.
 *
 * @param roleData - Role data to validate
 * @returns Validation result with errors if any
 */
export function validateRoleData(roleData: Partial<RoleData>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!roleData.player_name?.trim()) {
    errors.push('Player name is required');
  }
  if (!roleData.role_name?.trim()) {
    errors.push('Role name is required');
  }
  if (!roleData.role_description?.trim()) {
    errors.push('Role description is required');
  }
  if (!Array.isArray(roleData.guidelines) || roleData.guidelines.length === 0) {
    errors.push('At least one guideline is required');
  }
  if (!roleData.scenario_name?.trim()) {
    errors.push('Scenario name is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Filter chat logs to only include messages from specific player.
 * Useful for extracting one player's messages from full transcription.
 *
 * @param chatLogs - Full chat logs
 * @param playerId - Player ID to filter by
 * @returns Filtered chat logs
 */
export function filterChatLogsForPlayer(
  chatLogs: ChatLog[],
  playerId: string
): ChatLog[] {
  return chatLogs.filter((log) => log.speaker === playerId);
}
