class BinUtil {
    constructor(t, e) {
      (this.pos = 0), t && this.setBuf(t, e);
    }
    setBuf(t, e = 0) {
      (this.buf = new DataView(t, e)),
        (this.buf8 = new Uint8Array(t, e)),
        (this.pos = 0);
    }
    u8() {
      return this.buf8[this.pos++];
    }
    u16() {
      const t = this.buf.getUint16(this.pos, !0);
      return (this.pos += 2), t;
    }
    u24() {
      const t = 16777215 & this.buf.getUint32(this.pos, !0);
      return (this.pos += 3), t;
    }
    bn24() {
      return r.a.fromUint32(this.u24());
    }
    u32() {
      const t = this.buf.getUint32(this.pos, !0);
      return (this.pos += 4), t;
    }
    bn32() {
      return r.a.fromUint32(this.u32());
    }
    u40() {
      return this.u32() + 4294967296 * this.u8();
    }
    u56() {
      return this.u32() + 4294967296 * this.u24();
    }
    bn64() {
      const t = this.u32(),
        e = this.u32();
      return r.a.fromUint64(e, t);
    }
    bn72() {
      const t = this.u32(),
        e = this.u32(),
        a = this.u8();
      return r.a.fromUint96(a, e, t);
    }
    bn80() {
      const t = this.u32(),
        e = this.u32(),
        a = this.u16();
      return r.a.fromUint96(a, e, t);
    }
    addr160() {
      const t = this.buf8.slice(this.pos, (this.pos += 20));
      return t;
    }
    static addr160HexAt(t, e) {
      const a = i;
      let n = "0x";
      for (let r = 0; r < 20; r++) n += a.substr(2 * t[e++], 2);
      return n;
    }
    addr160Hex() {
      const t = i;
      let e = "0x",
        a = this.pos;
      for (let n = 0; n < 20; n++) e += t.substr(2 * this.buf8[a++], 2);
      return (this.pos = a), e;
    }
  }