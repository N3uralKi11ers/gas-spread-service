export interface DataForSend {
	person: {
		pos: {
			x: number
			y: number
		}
		velocity: number
	}
	gases: {
		pos: { x: number; y: number }
		gas_type: number
	}[]
	evacuation_map: {
		ev_map: number[][]
	}
}
