import { supabase } from "./supabase";

export async function getLeaderboard(quizId) {
  const { data, error } = await supabase
    .from("scores")
    .select(
      "id, player_name, score, quiz_id, quiz_title, submitted_at"
    )
    .eq("quiz_id", quizId)
    .order("score", { ascending: false })
    .order("submitted_at", { ascending: true })
    .limit(50);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function submitScore({
  playerName,
  score,
  quizId,
  quizTitle,
}) {
  const { data, error } = await supabase
    .from("scores")
    .insert({
      player_name: playerName.trim(),
      score,
      quiz_id: quizId,
      quiz_title: quizTitle,
    })
    .select(
      "id, player_name, score, quiz_id, quiz_title, submitted_at"
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}