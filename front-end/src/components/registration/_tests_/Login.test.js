import {render, screen} from '@testing-library/react'
import Login from '../Login'

test('Test 1', ()=> {
    render(<Login />)
    const linkElement = screen.getByText(/Login/i);
    expect(linkElement).toBeInTheDocument();
})