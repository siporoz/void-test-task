import { useState } from 'react'

interface Service {
  id: number
  name: string
  price: number
}

interface ServiceItem {
  service: Service
  quantity: number
}

const availableServices: Service[] = [
  { id: 1, name: 'Разработка лендинга', price: 50000 },
  { id: 2, name: 'Интернет-магазин', price: 150000 },
  { id: 3, name: 'Корпоративный портал', price: 300000 },
  { id: 4, name: 'SEO-оптимизация', price: 20000 },
]

export default function ProjectBuilder() {
  // ИСПРАВЛЕНО: добавленные услуги не появлялись в таблице и терялись при рендере.
  // Обычный массив не обновлял интерфейс. Теперь список хранится в useState.
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([])
  // ИСПРАВЛЕНО: кнопка «Добавить» оставалась недоступной после выбора услуги.
  // Обычная переменная не вызывала обновление интерфейса. Заменили её на useState.
  const [selectedServiceId, setSelectedServiceId] = useState<number | ''>('')
  // ИСПРАВЛЕНО: введённое количество сбрасывалось на 1 при выборе услуги.
  // При каждом рендере локальная переменная создавалась заново. useState сохраняет значение.
  const [quantity, setQuantity] = useState(1)

  let totalPrice = 0
  for (const item of selectedServices) {
    totalPrice += item.service.price * item.quantity
  }

  function addService() {
    const service = availableServices.find((s) => s.id === selectedServiceId)
    if (!service) return

    // ИСПРАВЛЕНО: push и изменение quantity напрямую не вызывали обновление таблицы.
    // Создаём новый массив из актуального состояния; при повторном добавлении увеличиваем количество.
    setSelectedServices((items) => {
      const existing = items.find((item) => item.service.id === service.id)
      if (existing) {
        return items.map((item) =>
          item.service.id === service.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      }
      return [...items, { service, quantity }]
    })
  }

  function removeService(item: ServiceItem) {
    // ИСПРАВЛЕНО: splice менял массив напрямую, поэтому удаление не обновляло таблицу.
    // Передаём в состояние новый массив без удалённой услуги.
    setSelectedServices((items) =>
      items.filter((entry) => entry.service.id !== item.service.id),
    )
  }

  return (
    <div
      className="project-builder"
      style={{ maxWidth: 700, margin: '0 auto', fontFamily: 'sans-serif' }}
    >
      <h2>Состав проекта</h2>

      <div
        className="add-service"
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: 24,
          alignItems: 'center',
        }}
      >
        <select
          value={selectedServiceId}
          onChange={(e) => {
            setSelectedServiceId(Number(e.target.value))
          }}
        >
          <option value="" disabled>
            Выберите услугу
          </option>
          {availableServices.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} — {service.price.toLocaleString()} ₽
            </option>
          ))}
        </select>

        <input
          type="number"
          min={1}
          max={10}
          value={quantity}
          onChange={(e) => {
            setQuantity(Number(e.target.value))
          }}
          style={{ width: 80, padding: '8px 12px' }}
        />

        <button onClick={addService} disabled={!selectedServiceId}>
          Добавить
        </button>
      </div>

      {selectedServices.length > 0 ? (
        <table
          className="services-table"
          style={{ width: '100%', borderCollapse: 'collapse' }}
        >
          <thead>
            <tr>
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: 10,
                  textAlign: 'left',
                }}
              >
                Услуга
              </th>
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: 10,
                  textAlign: 'left',
                }}
              >
                Цена за ед.
              </th>
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: 10,
                  textAlign: 'left',
                }}
              >
                Кол-во
              </th>
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: 10,
                  textAlign: 'left',
                }}
              >
                Сумма
              </th>
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: 10,
                  textAlign: 'left',
                }}
              ></th>
            </tr>
          </thead>
          <tbody>
            {selectedServices.map((item) => (
              <tr key={item.service.id}>
                <td style={{ border: '1px solid #ddd', padding: 10 }}>
                  {item.service.name}
                </td>
                <td style={{ border: '1px solid #ddd', padding: 10 }}>
                  {item.service.price.toLocaleString()} ₽
                </td>
                <td style={{ border: '1px solid #ddd', padding: 10 }}>
                  {item.quantity}
                </td>
                <td style={{ border: '1px solid #ddd', padding: 10 }}>
                  {(item.service.price * item.quantity).toLocaleString()} ₽
                </td>
                <td style={{ border: '1px solid #ddd', padding: 10 }}>
                  <button onClick={() => removeService(item)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} style={{ border: '1px solid #ddd', padding: 10 }}>
                <strong>Итого:</strong>
              </td>
              <td colSpan={2} style={{ border: '1px solid #ddd', padding: 10 }}>
                <strong>{totalPrice.toLocaleString()} ₽</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      ) : (
        <p style={{ color: '#888', fontStyle: 'italic' }}>
          Пока не добавлено ни одной услуги
        </p>
      )}
    </div>
  )
}
