function maxDifference(scores) {
    if (!scores || scores.length < 2) {
        return null;
    }

    let maxDiff = 0;

    for (let i = 0; i < scores.length; i++) {
        for (let j = i + 1; j < scores.length; j++) {
            const diff = Math.abs(scores[j] - scores[i]);
            if (diff > maxDiff) {
                maxDiff = diff;
            }
        }
    }

    return maxDiff;
}
