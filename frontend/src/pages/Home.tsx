import {
	Box,
	Button,
	FormControl,
	InputLabel,
	LinearProgress,
	MenuItem,
	Select,
	Typography,
} from '@mui/material'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { DataForSend } from '../shared/interfaces/dataForSend'

const Home = () => {
	const [file, setFile] = useState<File>()
	const [gasType, setGasType] = useState<string>('')
	const [positions, setPositions] = useState<
		{ x: number; y: number; gasType: string }[]
	>([])
	const navigation = useNavigate()

	const canvasRef = useRef<HTMLCanvasElement>(null)
	const canvas = canvasRef.current
	if (canvas && !positions.length) {
		canvas.width = canvas.parentElement?.clientWidth || 0
		canvas.height = canvas.parentElement?.clientHeight || 0
	}

	const mutationImg = useMutation({
		mutationFn: async (img: FormData) => {
			const data: number[][] = await (
				await axios.post(
					'http://localhost:8000/api/v1/process_evacuation_map',
					img
				)
			).data

			return data
		},
	})

	const mutationPos = useMutation({
		mutationFn: async (ev_map: number[][]) => {
			const dataForSend: DataForSend = {
				person: {
					pos: {
						x: positions[0].x,
						y: positions[0].y,
					},
					velocity: 1,
				},
				gases: positions.slice(1).map(position => ({
					pos: { x: position.x, y: position.y },
					gas_type: +position.gasType,
				})),
				evacuation_map: {
					ev_map,
				},
			}

			const data: number[][] = await (
				await axios.post(
					'http://localhost:8000/api/v1/process_time_series',
					dataForSend
				)
			).data

			return data
		},
	})

	useEffect(() => {
		const canvas = canvasRef.current

		if (gasType && canvas) {
			const context = canvas.getContext('2d')

			const handleClick = (e: MouseEvent) => {
				setPositions(prev => [...prev, { x: e.offsetX, y: e.offsetY, gasType }])

				if (context) {
					context.beginPath()
					context.fillStyle = !positions.length ? 'green' : 'red'
					context.arc(e.offsetX, e.offsetY, 10, 0, 2 * Math.PI)
					context.fill()
				}
			}

			canvas?.addEventListener('click', handleClick)

			return () => {
				canvas?.removeEventListener('click', handleClick)
			}
		}
	}, [gasType, positions.length])

	const handleSaveFile = (e: ChangeEvent<HTMLInputElement>) => {
		if (e && e?.target && e.target?.files) {
			setFile(e.target.files[0])
		}
	}

	const handleSend = () => {
		if (file) {
			const formData = new FormData()
			formData.append('file', file)
			mutationImg.mutate(formData)
		}
	}

	useEffect(() => {
		if (mutationImg.isSuccess) {
			console.log(mutationImg.data)
			localStorage.setItem('imgData', JSON.stringify(mutationImg.data))

			mutationPos.mutate(mutationImg.data)

			navigation('/result')
		}
	}, [mutationImg.data, mutationImg.isSuccess, mutationPos, navigation])

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				padding: '3rem',
				gap: '1rem',
			}}
		>
			<Box
				sx={{
					height: '10rem',
					width: '15rem',
					border: 'dashed',
					borderColor: '#1976D2',
					position: 'relative',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
				component={'label'}
			>
				<input
					style={{
						height: '100%',
						width: '100%',
						opacity: '0',
					}}
					hidden
					type='file'
					onChange={handleSaveFile}
				/>
				<Typography sx={{ position: 'absolute' }} variant='h5'>
					Добавьте картинку
				</Typography>
			</Box>
			{file && (
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
					<Typography sx={{ textAlign: 'center', fontSize: '1.5rem' }}>
						{!positions.length ? (
							<>Выберите позицию человека</>
						) : (
							<>Выберите позиции газа</>
						)}
					</Typography>
					<Box
						sx={{
							position: 'relative',
							height: '30rem',
							outline: 'dashed',
							outlineColor: '#1976D2',
						}}
					>
						<canvas
							style={{
								position: 'absolute',
							}}
							ref={canvasRef}
						/>
						<img style={{ height: '30rem' }} src={URL.createObjectURL(file)} />
					</Box>
					<FormControl fullWidth>
						<InputLabel id='select-label'>Тип газа</InputLabel>
						<Select
							labelId='select-label'
							id='select'
							value={gasType}
							label='Тип газа'
							onChange={e => setGasType(e.target.value)}
						>
							<MenuItem value=''>
								<em>None</em>
							</MenuItem>
							<MenuItem value={'Ten'}>Ten</MenuItem>
							<MenuItem value={'Twenty'}>Twenty</MenuItem>
							<MenuItem value={'Thirty'}>Thirty</MenuItem>
						</Select>
					</FormControl>
				</Box>
			)}
			{mutationImg.isLoading ? (
				<LinearProgress />
			) : (
				positions.length > 1 && (
					<Button variant='contained' onClick={handleSend}>
						Отправить
					</Button>
				)
			)}
		</Box>
	)
}

export default Home
