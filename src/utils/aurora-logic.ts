/**
 * Aurora Math Logic
 * High-performance, math-driven aurora wave simulation for HTML5 Canvas.
 * Optimized for 60fps and minimal memory footprint.
 */

export interface AuroraConfig {
  canvas: HTMLCanvasElement;
  colors: string[];
}

export class AuroraEffect {
  private ctx: CanvasRenderingContext2D;
  private width: number = 0;
  private height: number = 0;
  private time: number = 0;
  private waves: AuroraWave[] = [];
  private animationFrameId: number | null = null;
  private isPaused: boolean = false;

  constructor(private config: AuroraConfig) {
    const context = config.canvas.getContext('2d', { alpha: true });
    if (!context) throw new Error('Could not get canvas context');
    this.ctx = context;
    this.init();
  }

  private init() {
    this.resize();
    // Initialize ribbons with different characteristics for a layered look
    this.waves = [
      new AuroraWave(this.config.colors[0], 0.008, 40, 0.4, 0.4, 60), // Cyan base
      new AuroraWave(this.config.colors[1], 0.005, 60, 0.5, 0.3, 80), // Marine Blue deep
      new AuroraWave(this.config.colors[0], 0.012, 30, 0.6, 0.25, 40), // Cyan top highlight
    ];
  }

  public resize() {
    const parent = this.config.canvas.parentElement;
    this.width = this.config.canvas.width = parent?.clientWidth || window.innerWidth;
    this.height = this.config.canvas.height = parent?.clientHeight || 400;
  }

  public setPaused(paused: boolean) {
    this.isPaused = paused;
  }

  public start() {
    if (this.animationFrameId) return;
    const loop = () => {
      if (!this.isPaused) {
        this.update();
        this.draw();
      }
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  public stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private update() {
    this.time += 1;
    for (const wave of this.waves) {
      wave.update(this.time, this.width, this.height);
    }
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.globalCompositeOperation = 'screen';
    for (const wave of this.waves) {
      wave.draw(this.ctx, this.height);
    }
  }
}

class AuroraWave {
  private points: { x: number; y: number }[] = [];
  private readonly segments: number = 25;

  constructor(
    private color: string,
    private speed: number,
    private amplitude: number,
    private verticalOffset: number,
    private opacity: number,
    private thickness: number
  ) {}

  public update(time: number, width: number, height: number) {
    this.points = [];
    const step = width / this.segments;
    for (let i = 0; i <= this.segments; i++) {
      const x = i * step;
      // Multi-layered sine waves for natural fluid motion
      const noise =
        Math.sin(time * this.speed + i * 0.2) * this.amplitude +
        Math.sin(time * this.speed * 0.4 + i * 0.1) * (this.amplitude * 0.6) +
        Math.cos(time * this.speed * 0.7 + i * 0.3) * (this.amplitude * 0.3);

      const y = height * this.verticalOffset + noise;
      this.points.push({ x, y });
    }
  }

  public draw(ctx: CanvasRenderingContext2D, height: number) {
    if (this.points.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);

    for (let i = 1; i < this.points.length; i++) {
      const p = this.points[i];
      const prev = this.points[i - 1];
      const xc = (prev.x + p.x) / 2;
      const yc = (prev.y + p.y) / 2;
      ctx.quadraticCurveTo(prev.x, prev.y, xc, yc);
    }

    // Vertical gradient for the ribbon effect
    const midY = height * this.verticalOffset;
    const gradient = ctx.createLinearGradient(0, midY - this.thickness, 0, midY + this.thickness);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(0.5, this.color);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.shadowBlur = 20;
    ctx.shadowColor = this.color;
    ctx.strokeStyle = gradient;
    ctx.lineWidth = this.thickness;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = this.opacity;
    ctx.stroke();

    // Reset shadow for performance in next calls
    ctx.shadowBlur = 0;
  }
}
