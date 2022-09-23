/* eslint-disable comma-dangle */
export const initData = {
    boards: [
        {
            id: 'board-1',
            columnOrder: ['column-1', 'column-2', 'column-3'],
            columns: [
                {
                    id: 'column-1',
                    boardId: 'board-1',
                    title: 'To do column',
                    cardOrder: ['card-1', 'card-2', 'card-3', 'card-4', 'card-5'],
                    cards: [
                        {
                            id: 'card-1',
                            boardId: 'board-1',
                            columId: 'column-1',
                            title: 'Title of card 1',
                            cover: 'https://picsum.photos/200',
                        },
                        {
                            id: 'card-2',
                            boardId: 'board-1',
                            columId: 'column-1',
                            title: 'Title of card 2',
                            cover: null,
                        },
                        {
                            id: 'card-3',
                            boardId: 'board-1',
                            columId: 'column-1',
                            title: 'Title of card 3',
                            cover: null,
                        },
                        {
                            id: 'card-4',
                            boardId: 'board-1',
                            columId: 'column-1',
                            title: 'Title of card 4',
                            cover: null,
                        },
                        {
                            id: 'card-5',
                            boardId: 'board-1',
                            columId: 'column-1',
                            title: 'Title of card 5',
                            cover: null,
                        },
                    ],
                },
                {
                    id: 'column-2',
                    boardId: 'board-1',
                    title: 'Inprogress column',
                    cardOrder: ['card-6', 'card-7', 'card-8'],
                    cards: [
                        {
                            id: 'card-6',
                            boardId: 'board-1',
                            columId: 'column-2',
                            title: 'Title of card 6',
                            cover: null,
                        },
                        {
                            id: 'card-7',
                            boardId: 'board-1',
                            columId: 'column-2',
                            title: 'Title of card 7',
                            cover: null,
                        },
                        {
                            id: 'card-8',
                            boardId: 'board-1',
                            columId: 'column-2',
                            title: 'Title of card 8',
                            cover: null,
                        },
                    ],
                },
                {
                    id: 'column-3',
                    boardId: 'board-1',
                    title: 'Done column',
                    cardOrder: ['card-9', 'card-10', 'card-11'],
                    cards: [
                        {
                            id: 'card-9',
                            boardId: 'board-1',
                            columId: 'column-3',
                            title: 'Title of card 9',
                            cover: null,
                        },
                        {
                            id: 'card-10',
                            boardId: 'board-1',
                            columId: 'column-3',
                            title: 'Title of card 10',
                            cover: null,
                        },
                        {
                            id: 'card-11',
                            boardId: 'board-1',
                            columId: 'column-3',
                            title: 'Title of card 11',
                            cover: null,
                        },
                    ],
                },
            ],
        },
    ],
};
