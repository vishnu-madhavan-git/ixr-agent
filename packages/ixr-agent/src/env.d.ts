/// <reference types="vite/client" />
import type { IXRAgent } from './IXRAgent'

declare global {
	interface Window {
		ixrAgent?: IXRAgent
		IXRAgent: typeof IXRAgent
	}
}
