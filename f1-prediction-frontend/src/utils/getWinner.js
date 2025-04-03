export function getWinner(predictions) {
    if (!predictions || predictions.length === 0) return null;
    return predictions.reduce((max, p) => 
        p.points > max.points ? p : max, 
        predictions[0]
    );
}
