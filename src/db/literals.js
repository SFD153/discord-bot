export const countVotesLiteral = ({ user_id, attitude }) => `(
SELECT 
    COUNT(*) 
FROM 
    feedback
WHERE
    score = ${attitude} AND
    user_id = '${user_id}'
)`;

export const countVotesAllLiteral = `(
SELECT 
SUM(CASE WHEN score = 1 THEN 1 ELSE 0 END) AS positive_count,
SUM(CASE WHEN score = -1 THEN 1 ELSE 0 END) AS negative_count,
SUM(score) AS total_score,
user_id
FROM feedback
WHERE "createdAt" >= $1
GROUP BY user_id
ORDER BY total_score DESC
LIMIT 10
)`;

export const deleteFeedbackLiteral = `
DELETE FROM feedback
WHERE id = any (array(SELECT id FROM feedback WHERE user_id = $1 ORDER BY "createdAt" LIMIT $2));
`