import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='flex justify-center items-center h-screen'>
        <div className='text-center'>
        <p className="text-blue-600 font-bold">React app + Typescript + Tailwind</p>
        <div className='font-bold align-center'>{count}</div>
        <div>
            <button className="rounded bg-blue-600 text-white m-4 px-4 py-2" onClick={()=>setCount((count)=>count+1)}>+</button>
        </div>
        </div>
      </div>
    </>
  )
}

export default App
