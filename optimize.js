function maxDifference(scores) {
    if (!scores || scores.length < 2) {
        return null;
    }

    let minScore = scores[0];
    let maxDiff = 0;

    for (let i = 1; i < scores.length; i++) {
        const diff = scores[i] - minScore;
        if (diff > maxDiff) {
            maxDiff = diff;
        }
        if (scores[i] < minScore) {
            minScore = scores[i];
        }
    }

    return maxDiff;
}