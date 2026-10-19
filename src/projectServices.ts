// Вынес данные услуг и работу с localStorage отдельно, чтобы не перегружать компонент.
interface Service {
  id: number
  name: string
  price: number
}

export interface ServiceItem {
  service: Service
  quantity: number
}

export const availableServices: Service[] = [
  { id: 1, name: 'Разработка лендинга', price: 50000 },
  { id: 2, name: 'Интернет-магазин', price: 150000 },
  { id: 3, name: 'Корпоративный портал', price: 300000 },
  { id: 4, name: 'SEO-оптимизация', price: 20000 },
]

// ИСПРАВЛЕНО: после перезагрузки страницы список услуг пропадал.
// Добавил сохранение услуг и их количества в localStorage и восстановление при загрузке страницы.

const storageKey = 'project-builder:services'

export function loadSelectedServices(): ServiceItem[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]')
    if (!Array.isArray(saved)) return []

    return saved.flatMap((item: unknown) => {
      if (!item || typeof item !== 'object') return []
      if (!('serviceId' in item) || !('quantity' in item)) return []
      const service = availableServices.find((s) => s.id === item.serviceId)
      if (
        !service ||
        typeof item.quantity !== 'number' ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity < 1
      ) {
        return []
      }
      return [{ service, quantity: item.quantity }]
    })
  } catch {
    // Если хранилище недоступно или данные повреждены, начинаем с пустого списка.
    return []
  }
}

export function saveSelectedServices(items: ServiceItem[]): void {
  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify(
        items.map((item) => ({
          serviceId: item.service.id,
          quantity: item.quantity,
        })),
      ),
    )
  } catch {
    // Если запись недоступна, список продолжает работать в состоянии React.
  }
}
