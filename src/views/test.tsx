import { useState } from 'react'
import { ReactSortable } from "react-sortablejs"
import './test.less'
interface ItemType {
  id: number
  name: string
}

// https://sortablejs.github.io/Sortable/#simple-list

const Test = () => {
  const [state, setState] = useState<ItemType[]>([
    { id: 1, name: "1111" },
    { id: 2, name: "2222" },
  ])
  const [statee, setStatee] = useState<ItemType[]>([
    { id: 3, name: "3333" },
    { id: 4, name: "4444" },
  ])
  const [stateee, setStateee] = useState<ItemType[]>([
    { id: 5, name: "5555" },
    { id: 6, name: "6666" },
  ])

  return (
    <>
      <div className='test'>
        <ReactSortable
          list={state}
          group="groupName"
          animation={200}
          delay={2}
          setList={setState}
        >
          {state.map((item) => (
            <div key={item.id}>{item.name}</div>
          ))}
        </ReactSortable>
        <ReactSortable
          list={statee}
          group="groupName"
          animation={200}
          delay={2}
          setList={setStatee}>
          {statee.map((item) => (
            <div key={item.id}>{item.name}</div>
          ))}
        </ReactSortable>
        <ReactSortable
          list={stateee}
          group="groupName"
          animation={200}
          delay={2}
          setList={setStateee}>
          {stateee.map((item) => (
            <div key={item.id}>{item.name}</div>
          ))}
        </ReactSortable>
      </div>
      <div className="source">
        <div className="state">{JSON.stringify(state)}</div>
        <div className="state">{JSON.stringify(statee)}</div>
        <div className="statee">{JSON.stringify(stateee)}</div>
      </div>
    </>
  )
}

export default Test
