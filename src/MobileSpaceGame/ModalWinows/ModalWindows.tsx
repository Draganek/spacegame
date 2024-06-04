import { RefObject, Dispatch, SetStateAction, useState } from "react";
import "./ModalWindows.css";
const soundLevelWin = require("../sounds/level_win.wav");
const soundNextLevel = require("../sounds/next_level.wav");
const error = require("../sounds/error.mp3");
const accept = require("../sounds/accept.mp3");

interface UpgradesType {
    name: string;
    price: number;
    image: string;
    available: boolean;
    level: number;
}

export const GameLose = ({
    lifes,
    reset,
    level,
    record,
}: {
    lifes: number;
    reset: () => void;
    level: number;
    record: number;
}) => {
    return (
        <div id="game-end" className="card" hidden={Boolean(lifes)}>
            <h2>Koniec gry :(</h2>
            <h4>
                Udało ci się dojść do {level} poziomu! (Rekord: {record})
            </h4>
            Kosmiczne statki przedostały się na Ziemię...
            <br />
            <br />
            <button className="button" onClick={reset}>
                Zacznij od nowa
            </button>
        </div>
    );
};
export const StartMenu = ({
    startModal,
    reset,
    record,
}: {
    startModal: boolean;
    reset: () => void;
    record: number;
}) => {
    return (
        <div id="game-start" className="card" hidden={!startModal}>
            <h2>Zostań obrońcą ziemi!</h2>
            Nie pozwól, aby kosmiczne statki przedostały sie na Ziemię.
            <br />
            <br />
            <code>Poruszanie</code> - dotyk
            <br />
            <code>Strzał</code> - automatyczny
            <br />
            <br />
            <code>Twój rekord to: {record}</code>
            <br /> <br />
            <button className="button" onClick={reset}>
                Rozpocznij grę
            </button>
        </div>
    );
};
export const LevelWon = ({
    setMoney,
    newLevel,
    level,
    setLevel,
    setNewLevel,
    boardRef,
    playerRef,
    enemies,
    bullets,
    setUpgrades,
    upgrades,
    money,
    lifes,
    setLifes,
}: {
    newLevel: boolean;
    level: number;
    setLevel: Dispatch<SetStateAction<number>>;
    boardRef: RefObject<HTMLDivElement>;
    playerRef: RefObject<HTMLDivElement>;
    setNewLevel: Dispatch<
        SetStateAction<{ pause: boolean; startModal: boolean; levelModal: boolean }>
    >;
    enemies: HTMLDivElement[];
    bullets: HTMLDivElement[];
    setUpgrades: Dispatch<SetStateAction<UpgradesType[]>>;
    upgrades: UpgradesType[];
    money: number;
    setMoney: Dispatch<SetStateAction<number>>;
    lifes: number;
    setLifes: Dispatch<SetStateAction<number>>;
}) => {
    if (newLevel) {
        let file = new Howl({
            src: [soundLevelWin],
        });
        file.play();
    }
    const playSound = () => {
        let file = new Howl({
            src: [soundNextLevel],
        });
        file.play();
    };
    const changeLevel = (
        setLevel: Dispatch<SetStateAction<number>>,
        boardRef: RefObject<HTMLDivElement>,
        playerRef: RefObject<HTMLDivElement>,
        setNewLevel: Dispatch<SetStateAction<{ pause: boolean; startModal: boolean; levelModal: boolean }>>,
        enemies: HTMLDivElement[],
        bullets: HTMLDivElement[],
        setUpgrades: Dispatch<SetStateAction<UpgradesType[]>>,
        upgrades: UpgradesType[]
    ) => {
        setLevel((oldLevel) => oldLevel + 1);
        setNewLevel(prev => ({ ...prev, pause: false, startModal: false, levelModal: false }));
        enemies.forEach((enemy) => enemy.remove());
        bullets.forEach((bullet) => bullet.remove());
        playerRef.current!.style.left = "50%";
        playerRef.current!.style.bottom = "0%";
        boardRef.current!.style.animation = "moveBg 1.5s infinite linear";
    };

    const buyUpgrade = (
        index: number,
        cost: number,
        setMoney: Dispatch<SetStateAction<number>>,
        upgrades: UpgradesType[],
        lifes: number,
        setLifes: Dispatch<SetStateAction<number>>
    ) => {
        const updatedUpgrades = [...upgrades];
        if (money >= cost) {
            if (upgrades[index].name === "Heal") {
                if (lifes < upgrades[2].level) {
                    setMoney((prevMoney) => prevMoney - cost);
                    setLifes((prevLifes) => prevLifes + 1);
                }
            }
            if (upgrades[index].name === "Max HP") {
                setMoney((prevMoney) => prevMoney - cost);
                updatedUpgrades[index].level++;
                setUpgrades(updatedUpgrades);
            }
            if (upgrades[index].name === "Szybkość") {
                updatedUpgrades[index].level++;
                setUpgrades(updatedUpgrades);
                setMoney((prevMoney) => prevMoney - cost);
            }
            if (upgrades[index].name === "Strzały") {
                updatedUpgrades[index].level++;
                setUpgrades(updatedUpgrades);
                setMoney((prevMoney) => prevMoney - cost);
            }
            let file = new Howl({
                src: [accept],
            });
            file.play();
        } else {
            let file = new Howl({
                src: [error],
            });
            file.play();
        }
    };

    return (
        <div className="card" hidden={!newLevel}>
            <h2>Przeszedłeś poziom {level}!</h2>
            <div className="upgrade-window">
                {upgrades.map((upgrade, index) => (
                    <div
                        className={`upgrade-card ${upgrade.level >= 5 ? "disabled" : ""}`}
                        key={index}
                        onClick={() => {
                            if (upgrade.level < 5) {
                                buyUpgrade(
                                    index,
                                    upgrade.price,
                                    setMoney,
                                    upgrades,
                                    lifes,
                                    setLifes
                                );
                            }
                        }}
                    >
                        <img
                            src={require(`../../img/${upgrade.image}`)}
                            alt={upgrade.name}
                        />
                        <h3>
                            {upgrade.name} lvl.{upgrade.level}
                        </h3>
                        <h4>{upgrade.price}</h4>
                    </div>
                ))}
            </div>
            <br></br>
            <button
                className="button"
                onClick={() => {
                    changeLevel(
                        setLevel,
                        boardRef,
                        playerRef,
                        setNewLevel,
                        enemies,
                        bullets,
                        setUpgrades,
                        upgrades
                    );
                    playSound();
                }}
            >
                Następny poziom!
            </button>
        </div>
    );
};
