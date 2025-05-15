import focosBiomaService from "./graficos/focosBiomaService"
import focosEstadoService from "./graficos/focosEstadoService"
import riscoBiomaService from "./graficos/riscoBiomaService"
import riscoEstadoService from "./graficos/riscoEstadoService"
import areasBiomaService from "./graficos/areasBiomaService"
import areasEstadoService from "./graficos/areasEstadoService"

export const getServiceByFilters = (dataType: string, mapType: string) => {
  if (dataType === 'focos' && mapType === 'estado') return focosEstadoService
  if (dataType === 'focos' && mapType === 'bioma') return focosBiomaService
  if (dataType === 'riscos' && mapType === 'estado') return riscoEstadoService
  if (dataType === 'riscos' && mapType === 'bioma') return riscoBiomaService
  if (dataType === 'queimadas' && mapType === 'estado') return areasEstadoService
  if (dataType === 'queimadas' && mapType === 'bioma') return areasBiomaService

  return null
};