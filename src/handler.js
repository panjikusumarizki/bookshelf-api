const { nanoid } = require('nanoid')
const books = require('./books')

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  const id = nanoid(16)
  let finished = false

  if (readPage === pageCount) {
    finished = true
  }

  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const newBooks = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt
  }

  if (!newBooks.name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })

    response.code(400)
    return response
  }

  if (newBooks.readPage > newBooks.pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })

    response.code(400)
    return response
  }

  books.push(newBooks)

  const isSuccess = books.filter((book) => book.id === id).length > 0

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })

    response.code(201)
    return response
  }

  const response = h.response({
    status: 'error',
    message: 'Catatan gagal ditambahkan'
  })

  response.code(500)
  return response
}

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query

  // get data with name parameters
  if (name !== undefined) {
    const bookName = books.filter((book) => book.name === name)

    const mapBookName = bookName.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher
    }))

    if (mapBookName.length !== 0) {
      return {
        status: 'success',
        data: {
          books: mapBookName
        }
      }
    }

    const response = h.response({
      status: 'success',
      data: {
        books: mapBookName
      }
    })

    response.code(200)
    return response
  }

  if (reading !== undefined) {
    // get data with reading parameters
    if (reading == 0) {
      const bookUnread = books.filter((book) => book.reading === false)

      const mapBookUnread = bookUnread.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }))

      if (mapBookUnread.length !== 0) {
        return {
          status: 'success',
          data: {
            books: mapBookUnread
          }
        }
      }

      const response = h.response({
        status: 'success',
        data: {
          books: mapBookUnread
        }
      })

      response.code(200)
      return response
    } else if (reading == 1) {
      const bookRead = books.filter((book) => book.reading === true)

      const mapBookRead = bookRead.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }))

      if (mapBookRead.length !== 0) {
        return {
          status: 'success',
          data: {
            books: mapBookRead
          }
        }
      }

      const response = h.response({
        status: 'success',
        data: {
          books: mapBookRead
        }
      })

      response.code(200)
      return response
    }
  }

  if (finished !== undefined) {
    // get data with finished parameters
    if (finished == 0) {
      const bookUnfinished = books.filter((book) => book.finished === false)

      const mapBookUnfinished = bookUnfinished.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }))

      if (mapBookUnfinished.length !== 0) {
        return {
          status: 'success',
          data: {
            books: mapBookUnfinished
          }
        }
      }

      const response = h.response({
        status: 'success',
        data: {
          books: mapBookUnfinished
        }
      })

      response.code(200)
      return response
    } else if (finished == 1) {
      const bookFinished = books.filter((book) => book.finished === true)

      const mapBookFinished = bookFinished.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }))

      if (mapBookFinished.length !== 0) {
        return {
          status: 'success',
          data: {
            books: mapBookFinished
          }
        }
      }

      const response = h.response({
        status: 'success',
        data: {
          books: mapBookFinished
        }
      })

      response.code(200)
      return response
    }
  }

  // get all without parameters
  const mapBooks = books.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher
  }))

  if (mapBooks.length !== 0) {
    return {
      status: 'success',
      data: {
        books: mapBooks
      }
    }
  }

  const response = h.response({
    status: 'success',
    data: {
      books: mapBooks
    }
  })

  response.code(200)
  return response
}

const getBookByIdHandler = (request, h) => {
  const { id } = request.params

  const book = books.filter((n) => n.id === id)[0]

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book
      }
    }
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })

  response.code(404)
  return response
}

const editBookByIdHandler = (request, h) => {
  const { id } = request.params

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  const updatedAt = new Date().toISOString()

  const index = books.findIndex((book) => book.id === id)

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })

    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })

    response.code(400)
    return response
  }

  let finished = false
  if (readPage === pageCount) {
    finished = true
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt
    }

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })

    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })

  response.code(404)
  return response
}

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params

  const index = books.findIndex((book) => book.id === id)

  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })

    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })

  response.code(404)
  return response
}

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
}
