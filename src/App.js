import React from "react";
import Die from "./components/Die";
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';

export default function App() {

    const [dice, setDice] = React.useState(generateNewDiceArray())

    const [tenzies, setTenzies] = React.useState(false)

    const [bestRound, setBestRound] = React.useState( () => {
        JSON.parse(localStorage.getItem("Best Round") || 0)
    })

    React.useEffect( () => {
        localStorage.setItem("Best Round", tenzies.round)
    }, [tenzies])


    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue){
            setTenzies(true)
        }
    },[dice])

    function generateNewDiceArray(){

        let diceArray = []
        for (let i =0; i<10; i++){
            diceArray.push(generateNewDie())
        }
        return diceArray
    }

    function generateNewDie(){
        return {
            id: nanoid(),
            value:Math.ceil(Math.random()*6),
            isHeld: false
        }
    }

    function rollDice(){

        if (!tenzies){
            setDice( oldDice =>
                oldDice.map(die => {
                    return die.isHeld ?
                    die :
                    generateNewDie()
                }))
        } else {
            setTenzies(false)
            setDice(generateNewDiceArray())
        }
    }

    function holdDice(id){
        setDice(oldDice =>
            oldDice.map(die => {
            return die.id === id ?
            {...die, isHeld: !die.isHeld} :
            die
        }))
    }



    const diceElements = dice.map(
        die => (<Die
            key={die.id}
            value={die.value}
            isHeld={die.isHeld}
            holdDice={ () => holdDice(die.id)}
            />)
    )

    return(
        <main>
            { tenzies && <Confetti
            width={800}
            height={980}
            /> }
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="dice--container">
                {diceElements}
            </div>
            <button
            className="roll-dice"
            onClick={rollDice}
            >
            { tenzies ? "New Game" : "Roll" }
            </button>
        </main>
    )
}