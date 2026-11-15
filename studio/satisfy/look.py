# camera, lights, world, render settings (imported by sim runs)
import bpy, math
def setup(sc, w=720, h=1280, samples=24):
    bpy.ops.object.camera_add(location=(0,-5.6,3.2), rotation=(math.radians(68),0,0)); cam=bpy.context.object; cam.data.lens=42; sc.camera=cam
    bpy.ops.object.light_add(type='AREA',location=(2.5,-2.5,5)); l=bpy.context.object; l.data.energy=900; l.data.size=3; l.rotation_euler=(math.radians(35),math.radians(25),0)
    bpy.ops.object.light_add(type='AREA',location=(-3,-1,3)); l=bpy.context.object; l.data.energy=300; l.data.size=4; l.rotation_euler=(math.radians(60),math.radians(-50),0)
    bpy.ops.object.light_add(type='AREA',location=(0,3,4)); l=bpy.context.object; l.data.energy=400; l.data.size=3; l.rotation_euler=(math.radians(-40),0,0)
    wd=bpy.data.worlds.new('w'); sc.world=wd; wd.use_nodes=True; wd.node_tree.nodes['Background'].inputs['Color'].default_value=(0.62,0.68,0.78,1); wd.node_tree.nodes['Background'].inputs['Strength'].default_value=0.6
    r=sc.render; r.engine='CYCLES'; sc.cycles.device='CPU'; sc.cycles.samples=samples; sc.cycles.use_denoising=True
    sc.cycles.max_bounces=6; r.resolution_x=w; r.resolution_y=h; r.resolution_percentage=100
    r.image_settings.file_format='JPEG'; r.image_settings.quality=92
    sc.view_settings.view_transform='AgX'; sc.view_settings.look='AgX - Medium High Contrast'
