// http://man7.org/linux/man-pages/man2/stat.2.html
// mirrored from hyperdrive/lib/stat.js

function toHex (buf) {
  return buf.reduce((memo, i) => (
    memo + ('0' + i.toString(16)).slice(-2) // pad with leading 0 if <16
  ), '')
}

const Stat = function Stat (data) {
  if (!(this instanceof Stat)) return new Stat(data)

  /*
  TODO- are the following attrs needed?
  this.dev = 0
  this.nlink = 1
  this.rdev = 0
  this.blksize = 0
  this.ino = 0
  this.uid = data ? data.uid : 0
  this.gid = data ? data.gid : 0 */

  this.mode = data ? data.mode : 0
  this.size = data ? data.size : 0
  this.offset = data ? data.offset : 0
  this.blocks = data ? data.blocks : 0
  this.downloaded = data ? data.downloaded : 0
  this.atime = new Date(data ? data.mtime : 0) // we just set this to mtime ...
  this.mtime = new Date(data ? data.mtime : 0)
  this.ctime = new Date(data ? data.ctime : 0)
  this.mount = data && data.mount && data.mount.key
    ? {key: toHex(data.mount.key)}
    : null
  this.linkname = data ? data.linkname : null
  this.metadata = data ? data.metadata : {}
}

export default Stat

Stat.IFSOCK = 49152 // 0b1100...
Stat.IFLNK = 40960 // 0b1010...
Stat.IFREG = 32768 // 0b1000...
Stat.IFBLK = 24576 // 0b0110...
Stat.IFDIR = 16384 // 0b0100...
Stat.IFCHR = 8192 // 0b0010...
Stat.IFIFO = 4096 // 0b0001...

Stat.prototype.isSocket = check(Stat.IFSOCK)
Stat.prototype.isSymbolicLink = check(Stat.IFLNK)
Stat.prototype.isFile = check(Stat.IFREG)
Stat.prototype.isBlockDevice = check(Stat.IFBLK)
Stat.prototype.isDirectory = check(Stat.IFDIR)
Stat.prototype.isCharacterDevice = check(Stat.IFCHR)
Stat.prototype.isFIFO = check(Stat.IFIFO)

function check (mask) {
  return function () {
    return (mask & this.mode) === mask
  }
}
