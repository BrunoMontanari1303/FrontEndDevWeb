import { useQuery } from '@tanstack/react-query'
import { fetchVeiculos, fetchMotoristas, fetchUsuarios } from './api'

export const useVeiculosOptions = () =>
  useQuery({ queryKey:['veiculos'], queryFn:()=>fetchVeiculos(), staleTime: 5*60*1000 })

export const useMotoristasOptions = () =>
  useQuery({ queryKey:['motoristas'], queryFn:()=>fetchMotoristas(), staleTime: 5*60*1000 })

export const useUsuariosOptions = () =>
  useQuery({ queryKey:['usuarios'], queryFn:()=>fetchUsuarios(), staleTime: 5*60*1000 })
