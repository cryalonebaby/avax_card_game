import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from '../styles';
import { useGlobalContext } from '../context';
import { PageHOC, CustomButton, CustomInput, GameLoad } from '../components';

const CreateBattle = () => {
	const { contract, battleName, setBattleName, gameData, setErrorMessage } =
		useGlobalContext();
	const [waitBattle, setWaitBattle] = useState(false);
	const navigate = useNavigate();

	const handleClick = async () => {
		if (!battleName || !battleName.trim()) return null;

		try {
			await contract.createBattle(battleName, {
				gasLimit: 200000,
			});

			setWaitBattle(true);
		} catch (error) {
			setErrorMessage(error);
		}
	};

	useEffect(() => {
		if (gameData?.activeBattle?.battleStatus === 1) {
			navigate(`/battle/${gameData.activeBattle.name}`);
		} else if (gameData?.activeBattle?.battleStatus === 0) {
			setWaitBattle(true);
		}
	}, [gameData]);

	return (
		<>
			{waitBattle && <GameLoad />}

			<div className="flex flex-col mb-5">
				<CustomInput
					label="Battle"
					placeholder="Enter battle name"
					value={battleName}
					handleValueChange={setBattleName}
				/>

				<CustomButton
					title="Create battle"
					restStyles="mt-6"
					handleClick={handleClick}
				/>
			</div>

			<p className={styles.infoText} onClick={() => navigate('/join-battle')}>
				Or join already existing battles
			</p>
		</>
	);
};

export default PageHOC(
	CreateBattle,
	<>
		Create <br /> a new Battle
	</>,
	<>Create your own battle and wait for other players to join you</>
);
