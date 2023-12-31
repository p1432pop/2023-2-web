import React from 'react';
import { Link } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { loadSeason, setPage } from '../rankSlice';

import { getTierImg, getTierName } from '../utils/tier';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import Pagination from '@mui/material/Pagination';
import FormControl from '@mui/material/FormControl';
import TableContainer from '@mui/material/TableContainer';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import styles from '../style/Ranking.module.css';

export default function Ranking(props) {
	const value = useSelector((state) => state.rank);
    const dispatch = useDispatch();
	const StyledTableCell = styled(TableCell)(({ theme }) => ({
		[`&.${tableCellClasses.head}`]: {
		  	backgroundColor: theme.palette.common.black,
		  	color: theme.palette.common.white,
			textAlign: 'center'
		},
		[`&.${tableCellClasses.body}`]: {
		  	fontSize: 16,
			textAlign: 'center'
		},
	}));
	  
	const StyledTableRow = styled(TableRow)(({ theme }) => ({
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.action.hover,
		},
		// hide last border
		'&:last-child td, &:last-child th': {
		  	border: 0,
		},
	}));

	const pageHandler = (event, value) => {
		dispatch(setPage(value));
	};
	const seasonHandler = (event) => {
		dispatch(loadSeason(event.target.value));
	};
	const avatarImage = (codes) => {
		let arr = [];
		codes.forEach((code, index) => {
			if(code) {
				arr.push(<Avatar key={index} className={styles.mx} src={`image/CharacterIcon/${code}.png`} />)
			}
		})
		return arr;
	}
	return (
		<>
			<div>
				<div className={styles.topContent}>
					<div>정규시즌{value.season} 랭킹 최근 업데이트 : {value.updated.toDateString()}</div>
					<Box sx={{ width: 300 }}>
						<FormControl fullWidth>
							<Select
							defaultValue={2}
							onChange={seasonHandler}
							>
								<MenuItem value={2}>정규시즌2</MenuItem>
								<MenuItem value={1}>정규시즌1</MenuItem>
							</Select>
						</FormControl>
					</Box>
				</div>
				<TableContainer className={styles.my} component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<StyledTableCell>순위</StyledTableCell>
								<StyledTableCell>플레이어</StyledTableCell>
								<StyledTableCell>티어</StyledTableCell>
								<StyledTableCell>RP</StyledTableCell>
								<StyledTableCell>승률</StyledTableCell>
								<StyledTableCell>TOP 3</StyledTableCell>
								<StyledTableCell>게임 수</StyledTableCell>
								<StyledTableCell>평균 순위</StyledTableCell>
								<StyledTableCell>평균 킬</StyledTableCell>
								<StyledTableCell>모스트 실험체</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{value.current.map((row, idx) => (
								<StyledTableRow
								key={idx}
								sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
								>
									<StyledTableCell>{(value.page-1)*100+1+idx}</StyledTableCell>
									<StyledTableCell>
										<Link style={{textDecoration: 'none'}} to={`/player/${row.nickname}`}>{row.nickname}</Link>
									</StyledTableCell>
									<StyledTableCell>
										<div className={styles.avatarBox}>
											<Avatar className={styles.mx} src={getTierImg(row.mmr, (value.page-1)*100+1+idx)} />{getTierName(row.mmr, (value.page-1)*100+1+idx)}
										</div>
									</StyledTableCell>
									<StyledTableCell>{row.mmr >= 6000 ? row.mmr - 6000 : row.mmr%250}</StyledTableCell>
									<StyledTableCell>{(row.top1*100).toFixed(1)}%</StyledTableCell>
									<StyledTableCell>{(row.top3*100).toFixed(1)}%</StyledTableCell>
									<StyledTableCell>{row.totalGames}</StyledTableCell>
									<StyledTableCell>#{(row.averageRank).toFixed(1)}</StyledTableCell>
									<StyledTableCell>{(row.averageKills).toFixed(2)}</StyledTableCell>
									<StyledTableCell>
										<div className={styles.avatarBox}>
											{avatarImage([row.characterCode1, row.characterCode2, row.characterCode3])}
										</div>
									</StyledTableCell>
								</StyledTableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
				<Pagination className={styles.flexCenter} count={10} variant="outlined" page={value.page} shape="rounded" size="large" onChange={pageHandler} />
			</div >
		</>
	);
};