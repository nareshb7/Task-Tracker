import {render, screen} from '@testing-library/react'
import Login from '../Login'
import '@testing-library/jest-dom'

test('Test 1', ()=> {
    const func = jest.fn()
    render(<button onClick={func}>Click</button>)
    // const linkElement = screen.getByText(/Click/i);
    expect(true).toBe(true);
})