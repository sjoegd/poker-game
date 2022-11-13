import call_cycle0 from './move_cycle_calcs/call_cycle0'
import call_cycle1 from './move_cycle_calcs/call_cycle1'
import call_cycle2 from './move_cycle_calcs/call_cycle2'
import call_cycle3 from './move_cycle_calcs/call_cycle3'

import raise_cycle0 from './move_cycle_calcs/raise_cycle0'
import raise_cycle1 from './move_cycle_calcs/raise_cycle1'
import raise_cycle2 from './move_cycle_calcs/raise_cycle2'
import raise_cycle3 from './move_cycle_calcs/raise_cycle3'

// input: {number1, type1, number2, type2, rankWithRiver, playerState, currentCycle, move}
// output: {won}
export default function henk_v2({number1, type1, number2, type2, rankWithRiver, playerState, currentCycle, move}) {
    if(move == 'fold') {
        return {won: 0}
    }

    let net = getCorrectNeuralNet(move, currentCycle)
    return net({number1, type1, number2, type2, rankWithRiver, playerState})
}

function getCorrectNeuralNet(move, cycle) {
    return getAllNetsForMove(move)[cycle]
}

function getAllNetsForMove(move) {
    switch(move) {
        case 'call':
            return [
                call_cycle0,
                call_cycle1,
                call_cycle2,
                call_cycle3
            ]
        case 'raise':
            return [
                raise_cycle0,
                raise_cycle1,
                raise_cycle2,
                raise_cycle3
            ]
    }
}