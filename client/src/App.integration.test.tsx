import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react'
import App from './App';

import * as codeExamples from './code-data';
import { API_ROOT } from './config';


// required for jsdom to play nicely with Codemirror
document.createRange = () => {
  const range = new Range();

  range.getBoundingClientRect = jest.fn();

  range.getClientRects = jest.fn(() => ({
    item: () => null,
    length: 0,
  }));

  return range;
};

// scrollIntoView does not work with jsdom
window.HTMLElement.prototype.scrollIntoView = jest.fn()

const buildDummyCodeEvent = (count: number) => ({
  indent: "",
  key: "ifElse" + count,
  loc: { start: {line: count, column: 0 }, end: {line: count, column: 0 }},
  scopeStack: [],
  targetName: "[scope] ",
  type: "set"
})

const dummyCodeEvents = [...Array(5).keys()].map(buildDummyCodeEvent);

const server = setupServer(
  rest.post(`${API_ROOT}/annotate`, (req, res, ctx) => {
    
    return res(ctx.json({ events: [null, null, ...dummyCodeEvents] }))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('<App />', () => {
  describe('when first loaded', () => {
    it('renders a button to run All', () => {
      render(<App />);
      screen.getByText(/Run All/);
    });
  
    it('renders a button to step through code', () => {
      render(<App />);
      screen.getByText(/Step/);
    });
  });

  describe('when the api call results in an error', () => {
    it('should display an error', async () => {
      server.use(rest.post(`${API_ROOT}/annotate`, (req, res, ctx) => {
        return res(ctx.status(500))
      }));

      render(<App />)
      fireEvent.click(screen.getByText(/Run All/))
      await waitFor(() => screen.getByText(/Oops/))
    })
  })

  describe('when running all code', () => {
    beforeEach(async () => {
      render(<App />);
      fireEvent.click(screen.getByText(/Run All/))
      await waitFor(() => screen.getAllByTestId('log-line'))
    })

    it('should render all logs at once', async () => {
      const logLines = screen.getAllByTestId('log-line');
      expect(logLines).toHaveLength(5);
      await screen.findByText(new RegExp('ifElse4' as string));
    })

    it('should reset log lines when Step Forward is clicked', async () => {
      await screen.findByText(new RegExp('ifElse4' as string));
      fireEvent.click(screen.getByText(/Step/))
      const logLines = screen.getAllByTestId('log-line');
      expect(logLines).toHaveLength(1);
    })
  })

  describe('when stepping through code', () => {
    beforeEach(async () => {
      render(<App />);
      fireEvent.click(screen.getByText(/Step/))
      await waitFor(() => screen.getAllByTestId('log-line'))
    })

    it('should render a single element', async () => {
      const logLines = screen.getAllByTestId('log-line');
      expect(logLines).toHaveLength(1);
      expect(logLines[0]).toHaveTextContent(/set/)
    });

    it('should not break the behavior of run all', async () => {
      fireEvent.click(screen.getByText(/Run All/));
      await screen.findByText(new RegExp('ifElse4' as string))
      const logLines = await screen.getAllByTestId('log-line');
      expect(logLines).toHaveLength(5);
    });
  });

  describe('when stepping through code multiple times', () => {
    beforeAll(() => {
      render(<App />);
    });
    // TODO refactor for it.each
    it("should render a log line for each step", async () => {
      fireEvent.click(screen.getByText(/Step/))

      await screen.findByText(new RegExp('ifElse0' as string));
      expect(screen.getAllByTestId('log-line')).toHaveLength(1);

      fireEvent.click(screen.getByText(/Step/))
      await screen.findByText(new RegExp('ifElse1' as string));
      expect(screen.getAllByTestId('log-line')).toHaveLength(2);

      fireEvent.click(screen.getByText(/Step/))
      await screen.findByText(new RegExp('ifElse2' as string));
      expect(screen.getAllByTestId('log-line')).toHaveLength(3);

      fireEvent.click(screen.getByText(/Step/))
      await screen.findByText(new RegExp('ifElse3' as string));
      expect(screen.getAllByTestId('log-line')).toHaveLength(4);

      fireEvent.click(screen.getByText(/Step/))
      await screen.findByText(new RegExp('ifElse4' as string));
      expect(screen.getAllByTestId('log-line')).toHaveLength(5);
    })
  });
})
